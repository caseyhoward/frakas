import * as Repository from "../src/dynamo/Repository";
import * as TestDatabase from "./Database";

export const repository = Repository.create(
  "FracasTest",
  TestDatabase.database
);
