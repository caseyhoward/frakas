import "source-map-support/register";
import * as PubSub from "../dynamo/PubSub";
import * as Repository from "../dynamo/Repository";
import * as Database from "../dynamo/Database";
import * as GraphqlSchema from "../dynamo/GraphqlSchema";
import * as Environment from "../Environment";
import * as ApolloServerLambda from "apollo-server-lambda";
import * as AwsLambdaGraphql from "aws-lambda-graphql";

const environment: Environment.Environment = Environment.create();
console.log(environment);
const eventStore = new AwsLambdaGraphql.DynamoDBEventStore({
  eventsTable: `Events${environment.tableNameSuffix}`
});
const schema = GraphqlSchema.createWithoutSubscriptions(
  Repository.create(
    `Fracas${environment.tableNameSuffix}`,
    Database.createFromEnvironment(environment.dynamodb)
  ),
  PubSub.create(eventStore)
);

const server = new ApolloServerLambda.ApolloServer({
  schema,
  playground: { endpoint: environment.graphqlPath }
});

export const handler = server.createHandler({
  cors: {
    origin: [
      `http://${environment.clientDomain}`,
      `https://${environment.clientDomain}`
    ],
    methods: ["POST", "GET"]
  }
});
