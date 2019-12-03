import * as GraphqlSchema from "../../dynamo/GraphqlSchema";
import { repository } from "../../../test/Repository";
import * as TestPubSub from "../../../test/PubSub";
import * as PubSub from "fracas-core/src/PubSub";
import * as graphql from "graphql";
import * as GraphqlSubscriptions from "graphql-subscriptions";

describe("Mutation.updateGamePlayer", () => {
  it("works", async () => {
    const pubSub = TestPubSub.create();

    const schema = GraphqlSchema.create(repository, pubSub);
    const createGameResult = await graphql.execute({
      schema,
      document: createGameQuery()
    });
    const hostToken = createGameResult.data!.createGame;

    const subscription: AsyncIterableIterator<graphql.ExecutionResult<
      any
    >> = await (<any>graphql.subscribe({
      schema,
      document: configurationSubscribe(hostToken)
    }));

    const playerUpdateSubscription: AsyncIterableIterator<graphql.ExecutionResult<
      any
    >> = await (<any>graphql.subscribe({
      schema,
      document: subscribeGamePlayerUpdate(hostToken)
    }));

    const joinTokenResult = await graphql.execute({
      schema,
      document: getJoinTokenQuery(hostToken),
      variableValues: { playerToken: hostToken }
    });
    const joinToken = joinTokenResult.data!.gameOrConfiguration.joinToken;
    const next = subscription.next();
    const joinGameResult = await graphql.execute({
      schema,
      document: joinGameQuery(joinToken)
    });
    const playerToken = joinGameResult.data!.joinGame;

    const nextPlayerUpdate = playerUpdateSubscription.next();

    const updateGamePlayerResult = await graphql.execute({
      schema,
      document: updateGamePlayerMutation(playerToken, "some name")
    });
    const playerUpdate = await nextPlayerUpdate;
    expect(playerUpdate.value.data.gamePlayerUpdate.name).toEqual("some name");
  });
});

function updateGamePlayerMutation(
  playerToken: string,
  name: string
): graphql.DocumentNode {
  return graphql.parse(`mutation {
    updateGamePlayer: updateGamePlayer(
      playerToken: "${playerToken}",
      color: {red: 138, green: 226, blue: 52}, name: "${name}"
    )
  }`);
}

function createGameQuery(): graphql.DocumentNode {
  return graphql.parse(`mutation {
    createGame: createGame
  }`);
}

function getJoinTokenQuery(playerToken: string): graphql.DocumentNode {
  return graphql.parse(`query GameOrConfiguration ($playerToken: String) {
    gameOrConfiguration: gameOrConfiguration(playerToken: $playerToken) {
      ...on GameConfiguration {
        joinToken
      }
      ...on Game { id }
    }
  }`);
}

function joinGameQuery(joinToken: string): graphql.DocumentNode {
  return graphql.parse(
    `mutation { joinGame: joinGame(joinGameToken: "${joinToken}")}`
  );
}

function configurationSubscribe(playerToken: string): graphql.DocumentNode {
  return graphql.parse(`subscription {
    gameOrConfiguration: gameOrConfiguration(playerToken: "${playerToken}") {
      __typename
      ...on GameConfiguration {
        players {
          playerId: playerId
          color {
            red: red
            green: green
            blue: blue
          }
          name: name
        }
        mapId: mapId
        joinToken: joinToken
        currentUserPlayerId: currentUserPlayerId
        isCurrentUserHost: isCurrentUserHost
      }
      ...on Game {
        id: id
      }
    }
  }`);
}

function subscribeGamePlayerUpdate(playerToken: string) {
  return graphql.parse(`subscription {
    gamePlayerUpdate: gamePlayerUpdate(playerToken: "${playerToken}") {
      playerId: playerId
      color {
        red: red
        green: green
        blue: blue
      }
      name: name
    }
  }`);
}
