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
  console.log("looking up game or configuration");
  const { gameId, playerId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );
  console.log("Found player token");
  const players = await findAllPlayersForGame(gameId);
  console.log("Found all players", JSON.stringify(players));
  try {
    const configuration = await findGameConfigurationById(gameId);
    console.log("Found game configuration");
    const gameToken = await findGameTokenByGameId(gameId);
    console.log("found game token");
    return Models.gameConfigurationToGraphQl(
      playerId,
      players,
      configuration,
      gameToken
    );
  } catch (error) {
    console.log("Error looking up configuration", error);
    const game = await findGameById(gameId);
    return Models.gameToGraphql(game, playerId);
  }
  // return {
  //   id: "",
  //   map: {
  //     id: "",
  //     name: "",
  //     countries: [],
  //     bodiesOfWater: [],
  //     dimensions: { width: 0, height: 0 }
  //   },
  //   players: [],
  //   neutralCountryTroops: [],
  //   playerTurn: {
  //     playerId: "",
  //     playerTurnStage: Models.PlayerTurnStage.AttackAnnexOrPort
  //   },
  //   currentUserPlayerId: ""
  // };
}
