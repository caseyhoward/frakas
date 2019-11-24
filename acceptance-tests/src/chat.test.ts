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

// jest.setTimeout(15000);

// const graphqlSubscriptionUrl = "ws://localhost:4003";
// const graphqlHttpUrl = "http://localhost:4002/graphql";

const graphqlSubscriptionUrl = EnvironmentVariable.getString(
  "FRACAS_WEBSOCKET_ENDPOINT"
);
// const graphqlHttpUrl =
//   "https://4gw6frk910.execute-api.us-east-1.amazonaws.com/test/graphql";

describe("chat example", () => {
  it("works with subscription client", async () => {
    const apolloClient = createApolloClient();

    const observable = apolloClient.subscribe({
      query: subscriptionOperation()
    });

    const promise: Promise<any> = new Promise((resolve, reject) => {
      observable.subscribe({
        next(data) {
          resolve(data);
        },
        error(error) {
          reject(error);
        }
      });
    }).catch(error => {
      console.error(error);
    });

    // TODO: Can't await this promise or it hangs for some reason
    sendMessage(apolloClient, "hello");
    const subscribeResult = await promise;
    expect(subscribeResult.data.messageFeed.text).toEqual("hello");
    apolloClient.stop();
  });
});

function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  // const fragmentMatcher = new IntrospectionFragmentMatcher({
  //   introspectionQueryResultData: {
  //     __schema: {
  //       types: []
  //     }
  //   }
  // });
  const subscriptionClient = new SubscriptionClient(
    graphqlSubscriptionUrl,
    {
      lazy: false,
      reconnect: true
    },
    ws,
    []
  );

  const link = new WebSocketLink(subscriptionClient);

  return new ApolloClient({
    // cache: new InMemoryCache({ fragmentMatcher }),
    cache: new InMemoryCache(),
    link
  });
}

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
  apolloClient: ApolloClient<NormalizedCacheObject>,
  message: string
): Promise<any> {
  const mutation = gql`
    mutation SendMessageMutation($message: String!) {
      sendMessage(text: $message) {
        text
      }
    }
  `;
  return apolloClient.mutate({
    mutation,
    variables: { message: message },
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });
}
