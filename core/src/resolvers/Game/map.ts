import * as Graphql from "../../api/graphql";
import * as Models from "../../Models";
import * as Repository from "../../Repository";

export default async function gameMapResolver(
  findMapById: Repository.FindMapById,
  game: Graphql.Game
): Promise<Graphql.Map> {
  const map = await findMapById(Models.userMapId(game.map.id));
  return Models.mapToGraphql(map);
}
