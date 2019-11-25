import * as Models from "../../Models";
import * as Repository from "../../Repository";
import * as Graphql from "../../api/graphql";

export default async function createMap(
  createMap: Repository.CreateMap,
  input: Graphql.RequireFields<Graphql.MutationCreateMapArgs, "map">
): Promise<Graphql.Map> {
  const map = await createMap(input.map);
  return Models.mapToGraphql(map);
}
