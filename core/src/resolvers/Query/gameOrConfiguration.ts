import * as Repository from "../../Repository";
import * as graphql from "../../api/graphql";
import * as Models from "../../Models";

export default async function gameOrConfiguration(
  findGameById: Repository.FindGameById,
  findAllPlayersForGame: Repository.FindAllPlayersForGame,
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  findGameTokenByGameId: Repository.FindGameTokenByGameId,
  findGameConfigurationById: Repository.FindGameConfigurationById,
  input: graphql.RequireFields<graphql.QueryGameArgs, "playerToken">
): Promise<graphql.GameOrConfiguration> {
  const { gameId, playerId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );
  const players = await findAllPlayersForGame(gameId);
  try {
    const configuration = await findGameConfigurationById(gameId);
    const gameToken = await findGameTokenByGameId(gameId);
    return Models.gameConfigurationToGraphQl(
      playerId,
      players,
      configuration,
      gameToken
    );
  } catch (error) {
    const game = await findGameById(gameId);
    return Models.gameToGraphql(game, playerId);
  }
}
