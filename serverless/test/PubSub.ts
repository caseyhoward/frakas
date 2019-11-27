import * as GraphqlSubscriptions from "graphql-subscriptions";
import { SubscriptionResolveFn } from "fracas-core/src/api/graphql";
import * as PubSub from "fracas-core/src/PubSub";

export function create(
  pubSub = new GraphqlSubscriptions.PubSub()
): PubSub.PubSub {
  // const pubSub = new GraphqlSubscriptions.PubSub();
  return {
    publish(triggerName: string, payload: any): boolean {
      pubSub.publish(triggerName, payload);
      return true;
    },
    subscribe: eventName => {
      return (rootValue, args, context, info) => {
        return pubSub.asyncIterator(eventName);
      };
    },
    withFilter: <
      (
        asyncIteratorFn: SubscriptionResolveFn<any, any, any, any>,
        filterFn: GraphqlSubscriptions.FilterFn
      ) => SubscriptionResolveFn<any, any, any, any>
    >(<unknown>GraphqlSubscriptions.withFilter)
  };
}
