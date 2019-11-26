import * as AwsLambdaGraphql from "aws-lambda-graphql";
import * as GraphqlSubscriptions from "graphql-subscriptions";
import { SubscriptionResolveFn } from "fracas-core/src/api/graphql";
import * as PubSub from "fracas-core/src/PubSub";
import { SubscriptionResolveFn } from "fracas-core/src/api/graphql";

export function create(
  eventStore: AwsLambdaGraphql.DynamoDBEventStore
): PubSub.PubSub {
  const awsLambdaGraphqlPubSub = new AwsLambdaGraphql.PubSub({ eventStore });
  return {
    publish(triggerName: string, payload: any): boolean {
      console.log("publish", triggerName, payload);
      awsLambdaGraphqlPubSub.publish(triggerName, payload);
      return true;
    },
    subscribe: eventName => {
      return (rootValue, args, context, info) => {
        const result = awsLambdaGraphqlPubSub.subscribe(eventName);
        return result(rootValue, args, context, info);
      };
    },
    withFilter: <
      (
        asyncIteratorFn: SubscriptionResolveFn<any, any, any, any>,
        filterFn: GraphqlSubscriptions.FilterFn
      ) => SubscriptionResolveFn<any, any, any, any>
    >(<unknown>AwsLambdaGraphql.withFilter)
  };
}
