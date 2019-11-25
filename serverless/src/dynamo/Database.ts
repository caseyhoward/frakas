import * as AWS from "aws-sdk";

import * as Environment from "../Environment";

export type Database = {
  documentClient: AWS.DynamoDB.DocumentClient;
};

export function createFromEnvironment(
  environment: Environment.DynamoDbEnvironment
): Database {
  if (environment.type === "DynamoDbEnvironmentOptions") {
    return createFromRegionAndEndpoint(
      environment.region,
      environment.endpoint
    );
  } else {
    return { documentClient: new AWS.DynamoDB.DocumentClient() };
  }
}

export function createFromRegionAndEndpoint(
  region: string,
  endpoint: string
): Database {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region,
    endpoint
  });
  return { documentClient };
}

export function get(
  database: Database,
  tableName: string,
  key: AWS.DynamoDB.DocumentClient.Key
): Promise<AWS.DynamoDB.DocumentClient.AttributeMap | null> {
  const parameters: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: tableName,
    Key: key
  };

  return database.documentClient
    .get(parameters)
    .promise()
    .then(getOutput => getOutput.Item || null)
    .catch(error => {
      console.error(error);
      return null;
    });
}

export function put(
  database: Database,
  tableName: string,
  item: AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap
): Promise<void> {
  const parameters: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: item
  };
  return database.documentClient
    .put(parameters)
    .promise()
    .then(_ => undefined);
}

export function update(
  database: Database,
  tableName: string,
  key: AWS.DynamoDB.DocumentClient.Key,
  updateExpression: AWS.DynamoDB.DocumentClient.UpdateExpression,
  values: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap,
  attributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap
): Promise<void> {
  const parameters: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: values,
    ExpressionAttributeNames: attributeNames
  };
  return database.documentClient
    .update(parameters)
    .promise()
    .then(_ => undefined);
}

export function query(
  database: Database,
  tableName: string,
  keyExpression: AWS.DynamoDB.DocumentClient.KeyExpression,
  valueMap: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap
): Promise<AWS.DynamoDB.DocumentClient.AttributeMap[] | null> {
  const parameters: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: tableName,
    KeyConditionExpression: keyExpression,
    ExpressionAttributeValues: valueMap
  };

  return database.documentClient
    .query(parameters)
    .promise()
    .then(queryOutput => queryOutput.Items || null)
    .catch(error => {
      console.error(error);
      return null;
    });
}
