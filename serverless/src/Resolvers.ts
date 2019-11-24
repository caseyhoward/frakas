import { IResolvers } from "graphql-tools";

// import * as Repository from "./Repository";
import * as graphql from "fracas-core/src/api/graphql";
import { APIGatewayEvent, DynamoDBStreamEvent } from "aws-lambda";

// import * as assert from "assert";
import { makeExecutableSchema } from "graphql-tools";
import { ulid } from "ulid";
import * as Environment from "./Environment";
import * as Graphql from "./Graphql";
import {
  APIGatewayWebSocketEvent,
  createDynamoDBEventProcessor,
  createHttpHandler,
  createWsHandler,
  DynamoDBConnectionManager,
  DynamoDBEventStore,
  DynamoDBSubscriptionManager,
  // PubSub,
  withFilter
} from "aws-lambda-graphql";

// import createGame from "./resolvers/Mutation/createGame";
// import gameOrConfiguration from "./resolvers/Query/gameOrConfiguration";
// import game from "./resolvers/Query/game";
// import gameMap from "./resolvers/Game/map";
// import map from "./resolvers/Query/map";
// import maps from "./resolvers/Query/maps";
// import createMap from "./resolvers/Mutation/createMap";
// import saveGame from "./resolvers/Mutation/saveGame";
// import joinGame from "./resolvers/Mutation/joinGame";
// import startGame from "./resolvers/Mutation/startGame";
// import updateGamePlayerName from "./resolvers/Mutation/updateGamePlayerName";
// import updateGamePlayerColor from "./resolvers/Mutation/updateGamePlayerColor";
// import { updateMapForGame } from "./resolvers/Mutation/updateGameMap";
// import * as SubscriptionGame from "./resolvers/Subscription/game";
// import * as SubscriptionGameOrConfiguration from "./resolvers/Subscription/gameOrConfiguration";
// import * as PubSub from "./PubSub";
import * as PubSub from "fracas-core/src/PubSub";

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

const environment: Environment.Environment = Environment.create();

export function create(
  // repository: Repository.Repository,
  pubSub: PubSub.PubSub
): IResolvers<any, any> {
  return {
    Mutation: {
      async sendMessage(rootValue: any, { text, type }: SendMessageArgs) {
        const payload: Message = { id: ulid(), text, type };
        await pubSub.publish("NEW_MESSAGE", payload);
        return payload;
      }
    },
    Subscription: {
      messageFeed: {
        resolve: (rootValue: Message) => {
          // root value is the payload from sendMessage mutation
          return rootValue;
        },
        subscribe: withFilter(
          pubSub.subscribe("NEW_MESSAGE"),
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
