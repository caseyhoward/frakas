import fetch from "node-fetch";
// import * as Eventually from "fracas-core/src/test/Eventually";
import { SubscriptionClient } from "subscriptions-transport-ws";
import * as EnvironmentVariable from "fracas-core/src/EnvironmentVariable";
import ApolloClient from "apollo-client";
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import * as Helpers from "./helpers";
import * as Eventually from "fracas-core/test/Eventually";
import ws from "ws";

const graphqlSubscriptionUrl = EnvironmentVariable.getString(
  "FRACAS_WEBSOCKET_ENDPOINT"
);

const graphqlHttpUrl = EnvironmentVariable.getString("FRACAS_HTTP_ENDPOINT");

// const graphqlSubscriptionUrl = "ws://localhost:4003";
// const graphqlHttpUrl = "http://localhost:4002/graphql";

// const graphqlSubscriptionUrl =
//   "wss://axfhg8sn4d.execute-api.us-east-1.amazonaws.com/test";
// const graphqlHttpUrl =
//   "https://4gw6frk910.execute-api.us-east-1.amazonaws.com/test/graphql";

describe("blah", () => {
  it("works", async () => {
    // const apolloClient = createApolloClient();
    const hostToken = await createGame();
    const subscriptionClient = await createSubscriptionClient();
    // const apolloClient = await createApolloClient(subscriptionClient);

    const iterator = Helpers.subscribe({
      client: subscriptionClient,
      query: subscriptionOperation(hostToken)
    });
    // await sleep(5000);

    const joinToken = await getJoinToken(hostToken);
    const newPlayerToken = await joinGame(joinToken);

    console.log("Waiting for subscription");
    // const subscribeResult = await promise;
    // console.log(JSON.stringify(subscribeResult));
    return Eventually.eventually(async () => {
      const result = iterator.next();
      expect(result.value.data.gameOrConfiguration.players.length).toEqual(2);
      subscriptionClient.close();
    }, 5);
  });
});

async function createGame(): Promise<string> {
  const responseBody = await postGraphql(
    '{"query":"mutation {\\n  createGame: createGame\\n}"}'
  );
  return responseBody["createGame"];
}

async function getJoinToken(playerToken: string): Promise<any> {
  const body = `
  { "query": "query {\\n  gameOrConfiguration: gameOrConfiguration(playerToken: \\"${playerToken}\\") {\\n    __typename\\n    ...on GameConfiguration {\\n      players {\\n        playerId3832528868: playerId\\n        color {\\n          red1207450440: red\\n          green1207450440: green\\n          blue1207450440: blue\\n        }\\n        name3832528868: name\\n      }\\n      mapId: mapId\\n      joinToken: joinToken\\n      currentUserPlayerId3832528868: currentUserPlayerId\\n      isCurrentUserHost3880003826: isCurrentUserHost\\n    }\\n    ...on Game {\\n      id3832528868: id\\n      map {\\n        id3832528868: id\\n        name3832528868: name\\n        countries {\\n          id3832528868: id\\n          coordinates {\\n            x1207450440: x\\n            y1207450440: y\\n          }\\n          polygon {\\n            x1207450440: x\\n            y1207450440: y\\n          }\\n          waterEdges {\\n            point1 {\\n              x1207450440: x\\n              y1207450440: y\\n            }\\n            point2 {\\n              x1207450440: x\\n              y1207450440: y\\n            }\\n          }\\n          center {\\n            x1207450440: x\\n            y1207450440: y\\n          }\\n          neighboringCountries2741155849: neighboringCountries\\n          neighboringBodiesOfWater2741155849: neighboringBodiesOfWater\\n        }\\n        bodiesOfWater {\\n          id3832528868: id\\n          neighboringCountries2741155849: neighboringCountries\\n        }\\n        dimensions {\\n          width1207450440: width\\n          height1207450440: height\\n        }\\n      }\\n      playerTurn {\\n        playerId3832528868: playerId\\n        playerTurnStage840181146: playerTurnStage\\n        fromCountryId12867311: fromCountryId\\n        troopCount12867311: troopCount\\n      }\\n      players {\\n        id3832528868: id\\n        name3832528868: name\\n        countryTroopCounts {\\n          countryId3832528868: countryId\\n          troopCount1207450440: troopCount\\n        }\\n        capitol12867311: capitol\\n        color {\\n          red1207450440: red\\n          green1207450440: green\\n          blue1207450440: blue\\n        }\\n        ports2741155849: ports\\n      }\\n      neutralCountryTroops {\\n        countryId3832528868: countryId\\n        troopCount1207450440: troopCount\\n      }\\n      currentUserPlayerId3832528868: currentUserPlayerId\\n    }\\n  }\\n  maps {\\n    id3832528868: id\\n    name3832528868: name\\n    countries {\\n      id3832528868: id\\n      coordinates {\\n        x1207450440: x\\n        y1207450440: y\\n      }\\n      polygon {\\n        x1207450440: x\\n        y1207450440: y\\n      }\\n      waterEdges {\\n        point1 {\\n          x1207450440: x\\n          y1207450440: y\\n        }\\n        point2 {\\n          x1207450440: x\\n          y1207450440: y\\n        }\\n      }\\n      center {\\n        x1207450440: x\\n        y1207450440: y\\n      }\\n      neighboringCountries2741155849: neighboringCountries\\n      neighboringBodiesOfWater2741155849: neighboringBodiesOfWater\\n    }\\n    bodiesOfWater {\\n      id3832528868: id\\n      neighboringCountries2741155849: neighboringCountries\\n    }\\n    dimensions {\\n      width1207450440: width\\n      height1207450440: height\\n    }\\n  }\\n}"}`;
  // { "query": "query {\\n  gameOrConfiguration: gameOrConfiguration(playerToken: \\"${playerToken}\\") {\\n    __typename\\n    ...on GameConfiguration {\\n    joinToken: joinToken}\\n    ...on Game {\\n      id: id }\\n  }\\n}"}`;
  const responseBody = await postGraphql(body);
  return responseBody["gameOrConfiguration"]["joinToken"];
}

async function joinGame(joinToken: string): Promise<string> {
  const body = `{\"query\":\"mutation {\\n  joinGame: joinGame(joinGameToken: \\\"${joinToken}\\\")\\n}\"}`;
  const responseBody = await postGraphql(body);
  return responseBody["joinGame"];
}

async function postGraphql(body: string): Promise<any> {
  const response = await fetch(graphqlHttpUrl, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    body: body,
    method: "POST"
  });
  const responseBody = response.body.read().toString();
  // console.log(responseBody);
  return JSON.parse(responseBody)["data"];
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function createApolloClient(): ApolloClient<NormalizedCacheObject> {
//   const fragmentMatcher = new IntrospectionFragmentMatcher({
//     introspectionQueryResultData: {
//       __schema: {
//         types: []
//       }
//     }
//   });
//   const subscriptionClient = new SubscriptionClient(
//     graphqlSubscriptionUrl,
//     {
//       lazy: false,
//       reconnect: true
//     },
//     ws,
//     []
//   );

//   const link = new WebSocketLink(subscriptionClient);

//   return new ApolloClient({
//     cache: new InMemoryCache({ fragmentMatcher }),
//     link
//   });
// }

function subscriptionOperation(playerToken: string): DocumentNode {
  return gql`subscription {
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
  }`;
}

function testSubscriptionOperation(): DocumentNode {
  return gql`
    subscription {
      test: test
    }
  `;
}

async function createSubscriptionClient(): Promise<SubscriptionClient> {
  const subscriptionClient = new SubscriptionClient(
    graphqlSubscriptionUrl,
    {
      lazy: false,
      reconnect: true
    },
    ws,
    []
  );
  await Helpers.waitForClientToConnect(subscriptionClient);
  await new Promise(resolve => setTimeout(resolve, 200));
  return subscriptionClient;
}
