import { IResolvers } from "graphql-tools";

import * as Repository from "./Repository";
import * as graphql from "./api/graphql";

import createGame from "./resolvers/Mutation/createGame";
import gameOrConfiguration from "./resolvers/Query/gameOrConfiguration";
import game from "./resolvers/Query/game";
import gameMap from "./resolvers/Game/map";
import map from "./resolvers/Query/map";
import maps from "./resolvers/Query/maps";
import createMap from "./resolvers/Mutation/createMap";
import saveGame from "./resolvers/Mutation/saveGame";
import joinGame from "./resolvers/Mutation/joinGame";
import startGame from "./resolvers/Mutation/startGame";
import updateGamePlayerName from "./resolvers/Mutation/updateGamePlayerName";
import updateGamePlayerColor from "./resolvers/Mutation/updateGamePlayerColor";
import updateGamePlayer from "./resolvers/Mutation/updateGamePlayer";
import { updateMapForGame } from "./resolvers/Mutation/updateGameMap";
import * as SubscriptionGame from "./resolvers/Subscription/game";
import * as SubscriptionGameOrConfiguration from "./resolvers/Subscription/gameOrConfiguration";
import * as PubSub from "./PubSub";
import * as Player from "./models/Player";
import { ulid } from "ulid";

import { withFilter } from "aws-lambda-graphql";

type MessageType = "greeting" | "test";

type Message = {
  id: string;
  text: string;
  type: MessageType;
};

type SendMessageArgs = {
  text: string;
  type: MessageType;
};

export function create(
  repository: Repository.Repository,
  pubsub: PubSub.PubSub
): IResolvers<any, any> {
  return {
    ...createWithoutSubscriptions(repository, pubsub),

    Subscription: {
      gameOrConfiguration: {
        resolve: (
          _,
          input: graphql.RequireFields<
            graphql.SubscriptionGameArgs,
            "playerToken"
          >
        ) => {
          return SubscriptionGameOrConfiguration.resolve(
            repository.findGameById,
            repository.findAllPlayersForGame,
            repository.findGameIdAndPlayerIdByToken,
            repository.findGameTokenByGameId,
            repository.findGameConfigurationById,
            input
          );
        },
        subscribe: PubSub.subscribeGameConfiguration(pubsub)
      },
      game: {
        resolve: (
          _,
          input: graphql.RequireFields<
            graphql.SubscriptionGameOrConfigurationArgs,
            "playerToken"
          >
        ) => {
          return SubscriptionGame.resolve(
            repository.findGameIdAndPlayerIdByToken,
            repository.findGameById,
            input
          );
        },
        subscribe: PubSub.subscribeGame(pubsub)
      },
      gamePlayerUpdate: {
        resolve: (
          playerConfiguration: Player.PlayerConfiguration
        ): graphql.PlayerConfiguration => {
          return Player.playerConfigurationToGraphql(playerConfiguration);
        },
        subscribe: PubSub.subscribeGamePlayerUpdate(
          pubsub,
          repository.findGameIdAndPlayerIdByToken
        )
      },
      messageFeed: {
        resolve: (rootValue: Message) => {
          return rootValue;
        },
        subscribe: withFilter(
          pubsub.subscribe("NEW_MESSAGE"),
          (rootValue: Message, args: { type: null | MessageType }) => {
            if (args.type == null) {
              return true;
            }
            return args.type === rootValue.type;
          }
        )
      }
    }
  };
}

export function createWithoutSubscriptions(
  repository: Repository.Repository,
  pubsub: PubSub.PubSub
): IResolvers<any, any> {
  return {
    Query: {
      map: async (_, input) => map(repository.findMapById, input),
      maps: async () => maps(repository.findAllMaps),
      gameOrConfiguration: async (_, input) =>
        gameOrConfiguration(
          repository.findGameById,
          repository.findAllPlayersForGame,
          repository.findGameIdAndPlayerIdByToken,
          repository.findGameTokenByGameId,
          repository.findGameConfigurationById,
          input
        ),
      game: async (_, input) =>
        game(
          repository.findGameIdAndPlayerIdByToken,
          repository.findGameById,
          input
        )
    },
    Mutation: {
      async sendMessage(rootValue: any, { text, type }: SendMessageArgs) {
        const payload: Message = { id: ulid(), text, type };
        await pubsub.publish("NEW_MESSAGE", payload);
        return payload;
      },
      createMap: async (_, input) => createMap(repository.createMap, input),
      joinGame: (_, input) =>
        joinGame(
          repository.createPlayerConfiguration,
          repository.createPlayerToken,
          repository.findAllPlayersForGame,
          repository.findGameIdByToken,
          pubsub,
          input
        ),
      createGame: () =>
        createGame(
          repository.createGameToken,
          repository.createGameConfiguration,
          repository.createPlayerToken,
          repository.createPlayerConfiguration
        ),
      startGame: (_, input) =>
        startGame(
          repository.findGameIdAndPlayerIdByToken,
          repository.findGameConfigurationById,
          repository.findAllPlayersForGame,
          repository.updateGame,
          pubsub,
          input
        ),
      updateGamePlayerName: (_, input) =>
        updateGamePlayerName(
          pubsub,
          repository.findGameIdAndPlayerIdByToken,
          repository.updatePlayerName,
          input
        ),
      updateGamePlayerColor: (_, input) =>
        updateGamePlayerColor(
          pubsub,
          repository.findGameIdAndPlayerIdByToken,
          repository.updatePlayerColor,
          input
        ),
      updateGamePlayer: (_, input) =>
        updateGamePlayer(
          pubsub,
          repository.findGameIdAndPlayerIdByToken,
          repository.updateGamePlayer,
          input
        ),
      updateGameMap: (_, input) =>
        updateMapForGame(
          repository.findGameIdAndPlayerIdByToken,
          repository.updateGameMap,
          pubsub,
          input
        ),
      saveGame: async (_, input) =>
        saveGame(
          repository.findGameIdAndPlayerIdByToken,
          repository.updateGameWithoutMap,
          pubsub,
          input
        )
    },
    GameOrConfiguration: {
      __resolveType: (gameOrConfiguration: graphql.GameOrConfiguration) =>
        gameOrConfiguration.__typename
    },
    Game: {
      map: (input, _) => gameMap(repository.findMapById, input)
    }
  };
}
