import * as AwsLambdaGraphql from "aws-lambda-graphql";
import * as GraphqlSubscriptions from "graphql-subscriptions";
import * as PubSub from "fracas-core/src/PubSub";

// export function create(): PubSub.PubSub {
//   const eventStore = new AwsLambdaGraphql.DynamoDBEventStore();
//   const awsLambdaGraphqlPubSub = new AwsLambdaGraphql.PubSub({ eventStore });
//   return {
//     publish(triggerName: string, payload: any): Promise<void> {
//       console.log("publish", triggerName, payload);
//       return awsLambdaGraphqlPubSub.publish(triggerName, payload);
//     },
//     // subscribe: <any>((eventName: string) => {
//     //   return async (rootValue: any, args: any, context: any, info: any) => {
//     //     console.log("**************", rootValue, JSON.stringify(args));
//     //     return await (<PubSub.SubscriptionResolveFunction>(
//     //       (<unknown>awsLambdaGraphqlPubSub.subscribe(eventName))
//     //     ))(rootValue, args, context, info);
//     //   };
//     // }),
//     subscribe: <any>((eventName: any) => {
//       return (rootValue: any, args: any, context: any, info: any) => {
//         const result = awsLambdaGraphqlPubSub.subscribe(eventName);
//         return result(rootValue, args, context, info);
//       };
//     }),
//     withFilter: <
//       (
//         asyncIteratorFn: PubSub.SubscriptionResolveFunction,
//         filterFn: GraphqlSubscriptions.FilterFn
//       ) => PubSub.SubscriptionResolveFunction
//     >(<unknown>AwsLambdaGraphql.withFilter)
//   };
// }

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
    }
  };
}
