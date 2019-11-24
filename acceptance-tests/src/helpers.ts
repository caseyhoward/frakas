// https://github.com/michalkvasnicak/aws-lambda-graphql/blob/master/packages/aws-lambda-graphql/src/fixtures/helpers.ts

import { GraphQLRequest, ExecutionResult } from "apollo-link";
// import { Client } from "../client";
import { SubscriptionClient } from "subscriptions-transport-ws";

export function waitForClientToConnect(client: SubscriptionClient) {
  return new Promise(resolve => {
    client.onConnected(resolve);
  });
}

export function execute({
  client,
  extensions,
  operationName,
  query,
  variables
}: { client: SubscriptionClient } & GraphQLRequest): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    try {
      let value: any;

      const subscriber = {
        next(val: any) {
          value = val;
          // Apollo client does not call complete() on query/mutation operations
          resolve(value);
        },
        complete() {
          resolve(value);
        },
        error(err: any) {
          reject(err);
        }
      };

      client
        .request({
          extensions,
          operationName,
          query,
          variables
        })
        .subscribe(subscriber);
    } catch (e) {
      reject(e);
    }
  });
}

export function subscribe({
  client,
  extensions,
  operationName,
  query,
  variables
}: { client: SubscriptionClient } & GraphQLRequest): Iterator<any> {
  const events: any[] = [];

  const subscriber = {
    next(event: any) {
      events.push(event);
    },
    complete() {
      events.push(new Error("Subscription cannot be done"));
    },
    error(err: any) {
      events.push(err);
    }
  };

  const ob = client
    .request({
      extensions,
      operationName,
      query,
      variables
    })
    .subscribe(subscriber);

  return {
    next() {
      const event = events.shift();

      // if (event) {
      //   if (event instanceof Error) {
      //     throw event;
      //   }

      //   return { done: false, value: event };
      // }

      // ob.unsubscribe();

      // return { done: true, value: undefined };
      return { done: false, value: event };
    }
  };
}