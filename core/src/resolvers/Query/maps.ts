import * as Models from "../../Models";
import * as Repository from "../../Repository";
import * as Graphql from "../../api/graphql";

export default async function maps(
  findAllMaps: Repository.FindAllMaps
): Promise<Graphql.Map[]> {
  const maps = await findAllMaps();
  return maps.map(Models.mapToGraphql);
}
