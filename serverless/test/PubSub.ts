import * as GraphqlSubscriptions from "graphql-subscriptions";
import * as PubSub from "fracas-core/src/PubSub";

export function create(): PubSub.PubSub {
  const pubSub = new GraphqlSubscriptions.PubSub();
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
    withFilter: GraphqlSubscriptions.withFilter
  };
}
