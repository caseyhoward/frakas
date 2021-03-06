import { APIGatewayEvent, DynamoDBStreamEvent } from "aws-lambda";
import {
  APIGatewayWebSocketEvent,
  createDynamoDBEventProcessor,
  createHttpHandler,
  createWsHandler,
  DynamoDBConnectionManager,
  DynamoDBEventStore,
  DynamoDBSubscriptionManager
} from "aws-lambda-graphql";
import { makeExecutableSchema } from "graphql-tools";
import * as Environment from "../Environment";
import * as Graphql from "../Graphql";
import * as Resolvers from "fracas-core/src/Resolvers";
import * as PubSub from "../dynamo/PubSub";
import * as Repository from "../dynamo/Repository";
import * as Database from "../dynamo/Database";

const environment: Environment.Environment = Environment.create();

const eventStore = new DynamoDBEventStore({
  eventsTable: `Events${environment.tableNameSuffix}`
});

const pubSub = PubSub.create(eventStore);

const schema = makeExecutableSchema({
  typeDefs: Graphql.typeDefs,
  resolvers: Resolvers.create(
    Repository.create(
      `Fracas${environment.tableNameSuffix}`,
      Database.createFromEnvironment(environment.dynamodb)
    ),
    pubSub
  )
});

const subscriptionManager = new DynamoDBSubscriptionManager({
  subscriptionOperationsTableName: `SubscriptionOperations${environment.tableNameSuffix}`,
  subscriptionsTableName: `Subscriptions${environment.tableNameSuffix}`
});

const connectionManager = new DynamoDBConnectionManager({
  subscriptions: subscriptionManager,
  connectionsTable: `Connections${environment.tableNameSuffix}`
});

const eventProcessor = createDynamoDBEventProcessor({
  connectionManager,
  schema,
  subscriptionManager
});
const wsHandler = createWsHandler({
  connectionManager,
  schema,
  subscriptionManager
});
const httpHandler = createHttpHandler({
  connectionManager,
  schema
});

export async function handler(
  event: APIGatewayEvent | APIGatewayWebSocketEvent | DynamoDBStreamEvent,
  context: any
) {
  // detect event type
  if ((event as DynamoDBStreamEvent).Records != null) {
    // event is DynamoDB stream event
    return eventProcessor(event as DynamoDBStreamEvent, context, null as any);
  }
  if (
    (event as APIGatewayWebSocketEvent).requestContext != null &&
    (event as APIGatewayWebSocketEvent).requestContext.routeKey != null
  ) {
    // event is web socket event from api gateway v2
    return wsHandler(event as APIGatewayWebSocketEvent, context);
  }
  if (
    (event as APIGatewayEvent).requestContext != null &&
    (event as APIGatewayEvent).requestContext.path != null
  ) {
    // event is http event from api gateway v1
    return httpHandler(event as APIGatewayEvent, context, null as any);
  }
  throw new Error("Invalid event");
}
