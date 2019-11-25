// import fetch from "node-fetch";
import * as Eventually from "fracas-core/test/Eventually";
import * as EnvironmentVariable from "fracas-core/src/EnvironmentVariable";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ApolloClient from "apollo-client";
import fetch from "cross-fetch";
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import ws from "ws";
import * as Helpers from "./helpers";

// jest.setTimeout(15000);
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

// const graphqlSubscriptionUrl = "ws://localhost:4003";
// const graphqlHttpUrl = "http://localhost:4002/graphql";

const graphqlSubscriptionUrl = EnvironmentVariable.getString(
  "FRACAS_WEBSOCKET_ENDPOINT"
);
// const graphqlHttpUrl =
//   "https://4gw6frk910.execute-api.us-east-1.amazonaws.com/test/graphql";

describe("chat example", () => {
  for (let i = 0; i < 20; ++i) {
    it("works with subscription client " + i, async () => {
      const subscriptionClient = await createSubscriptionClient();
      // const apolloClient = await createApolloClient(subscriptionClient);

      const iterator = Helpers.subscribe({
        client: subscriptionClient,
        query: subscriptionOperation()
      });

      const timestamp = new Date().getTime();
      const message = `hello-${timestamp}`;

      await Eventually.eventually(async () => {
        await sendMessage(subscriptionClient, JSON.stringify(message));
        const result = iterator.next();
        console.log("******************* Got result ", result);
        expect(result.value.data.messageFeed.text).toEqual(message);
      }, 5);

      subscriptionClient.close();
    });
  }
});

// async function createApolloClient(
//   subscriptionClient: SubscriptionClient
// ): Promise<ApolloClient<NormalizedCacheObject>> {
//   // const fragmentMatcher = new IntrospectionFragmentMatcher({
//   //   introspectionQueryResultData: {
//   //     __schema: {
//   //       types: []
//   //     }
//   //   }
//   // });

//   const link = new WebSocketLink(subscriptionClient);

//   return new ApolloClient({
//     // cache: new InMemoryCache({ fragmentMatcher }),
//     cache: new InMemoryCache(),
//     link
//   });
// }

function subscriptionOperation(): DocumentNode {
  return gql`
    subscription MessageFeed {
      messageFeed {
        id
        text
      }
    }
  `;
}

function sendMessage(
  subscriptionClient: SubscriptionClient,
  message: string
): Promise<any> {
  const mutation = gql`
    mutation SendMessageMutation($message: String!) {
      sendMessage(text: $message) {
        text
      }
    }
  `;

  return Helpers.execute({
    client: subscriptionClient,
    query: mutation,
    variables: { message: message }
  });
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
