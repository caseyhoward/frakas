import "./main.css";
import { Elm } from "./Main.elm";
import * as serviceWorker from "./serviceWorker";
import { SubscriptionClient } from "subscriptions-transport-ws";
// import ApolloClient from "apollo-client";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { WebSocketLink } from "apollo-link-ws";
import gql from "graphql-tag";
// import * as graphql from "graphql";

const graphqlSubscriptionUrl = process.env.ELM_APP_SUBSCRIPTION_URL;
const graphqlHttpnUrl = process.env.ELM_APP_GRAPHQL_URL;

// Server

// const cache = new InMemoryCache();

// const link = new WebSocketLink({
//   uri: graphqlSubscriptionUrl,
//   options: {
//     reconnect: true
//   }
// });

// const apolloClient = new ApolloClient({
//   cache,
//   link
// });

// Serverless 1

// const subscriptionClient = new SubscriptionClient(
//   graphqlSubscriptionUrl,
//   {
//     lazy: false,
//     reconnect: true
//   },
//   null,
//   []
// );

// const link = new WebSocketLink(subscriptionClient);

// const apolloClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   link
// });

export function waitForClientToConnect(client) {
  return new Promise(resolve => {
    client.onConnected(resolve);
  });
}

async function createSubscriptionClient() {
  const subscriptionClient = new SubscriptionClient(
    graphqlSubscriptionUrl,
    {
      lazy: false,
      reconnect: true
    },
    ws,
    []
  );
  await waitForClientToConnect(subscriptionClient);
  return subscriptionClient;
}

document.addEventListener("DOMContentLoaded", async function() {
  // let notifiers = [];

  const subscriptionClient = await createSubscriptionClient();

  const app = Elm.Main.init({
    node: document.getElementById("root"),
    flags: {
      apiUrl: graphqlHttpnUrl,
      viewport: {
        width: Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        ),

        height: Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        )
      }
    }
  });

  app.ports.createSubscriptions.subscribe(subscription => {
    // notifiers = [subscription].map(operation => {
    subscriptionClient
      .request({
        query: gql`
          ${subscription}
        `
      })
      .subscribe({
        next(data) {
          console.log("Got subscription data: ", JSON.stringify(data));
          app.ports.gotSubscriptionData.send(data);
        },
        error(error) {
          console.log(error);
        }
      });
    // });
  });
  // app.ports.createSubscriptions.subscribe(subscription => {
  //   // notifiers = [subscription].map(operation => {
  //   apolloClient
  //     .subscribe({
  //       query: gql`
  //         ${subscription}
  //       `
  //     })
  //     .subscribe({
  //       next(data) {
  //         app.ports.gotSubscriptionData.send(data);
  //       },
  //       error(error) {
  //         console.log(error);
  //       }
  //     });
  //   // });
  // });
});

serviceWorker.unregister();
