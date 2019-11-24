import * as EnvironmentVariable from "fracas-core/src/EnvironmentVariable";

export type Environment = {
  graphqlPath: string;
  clientDomain: string;
  subscriptionsPath: string;
  tableNameSuffix: string;
  dynamodb: DynamoDbEnvironment;
};

export type DynamoDbEnvironment =
  | DynamoDbEnvironmentOptions
  | NoDynamoDbEnvironmentOptions;

export type NoDynamoDbEnvironmentOptions = {
  type: "NoDynamoDbEnvironmentOptions";
};

export type DynamoDbEnvironmentOptions = {
  type: "DynamoDbEnvironmentOptions";
  endpoint: string;
  region: string;
};

export function create(): Environment {
  const envWithoutDynamodb = {
    // clientDomain: EnvironmentVariable.getString("FRACAS_CLIENT_DOMAIN"),
    clientDomain: "localhost:3000",
    // graphqlPath: EnvironmentVariable.getString("FRACAS_GRAPHQL_PATH"),
    graphqlPath: "",
    subscriptionsPath:
      EnvironmentVariable.getStringOption("FRACAS_SUBSCRIPTIONS_PATH") || "",
    tableNameSuffix: EnvironmentVariable.getString("FRACAS_TABLE_NAME_SUFFIX")
  };
  const endpoint = EnvironmentVariable.getStringOption(
    "FRACAS_DYNAMODB_ENDPOINT"
  );
  const region = EnvironmentVariable.getStringOption("FRACAS_DYNAMODB_REGION");
  if (endpoint && endpoint != "" && region) {
    return {
      ...envWithoutDynamodb,
      dynamodb: {
        type: "DynamoDbEnvironmentOptions",
        endpoint: EnvironmentVariable.getString("FRACAS_DYNAMODB_ENDPOINT"),
        region: region
      }
    };
  } else {
    return {
      ...envWithoutDynamodb,
      dynamodb: { type: "NoDynamoDbEnvironmentOptions" }
    };
  }
}
