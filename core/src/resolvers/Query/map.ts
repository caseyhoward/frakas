import * as Graphql from "../../api/graphql";
import * as Models from "../../Models";
import * as Repository from "../../Repository";

export default async function map(
  findMapById: Repository.FindMapById,
  input: Graphql.QueryMapArgs
): Promise<Graphql.Map> {
  const map = await findMapById(Models.userMapId(input.id));
  return Models.mapToGraphql(map);
}
