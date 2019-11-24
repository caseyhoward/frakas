import * as Database from "../src/dynamo/Database";

export const database: Database.Database = Database.createFromEnvironment({
  type: "DynamoDbEnvironmentOptions",
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});
