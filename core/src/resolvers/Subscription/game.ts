import * as Graphql from "../../api/graphql";
import * as Models from "../../Models";
import * as Repository from "../../Repository";

export async function resolve(
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  findGameById: Repository.FindGameById,
  input: Graphql.RequireFields<Graphql.SubscriptionGameArgs, "playerToken">
): Promise<Graphql.Game> {
  const { playerId, gameId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );
  const game = await findGameById(gameId);
  return Models.gameToGraphql(game, playerId);
}
