import * as graphql from "../../api/graphql";
import * as Models from "../../Models";
import * as Repository from "../../Repository";

export default async function game(
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  findGameById: Repository.FindGameById,
  input: graphql.RequireFields<graphql.QueryGameArgs, "playerToken">
): Promise<graphql.Game> {
  const { playerId, gameId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );
  const game = await findGameById(gameId);
  return Models.gameToGraphql(game, playerId);
}
