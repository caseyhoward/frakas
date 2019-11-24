import * as PubSub from "../../PubSub";
import * as Player from "../../models/Player";
import * as Models from "../../Models";
import * as Repository from "../../Repository";
import * as graphql from "../../api/graphql";

export default async function startGame(
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  findGameConfigurationById: Repository.FindGameConfigurationById,
  findAllPlayersForGame: Repository.FindAllPlayersForGame,
  saveGame: Repository.UpdateGame,
  pubSub: PubSub.PubSub,
  input: graphql.RequireFields<graphql.MutationStartGameArgs, "playerToken">
): Promise<boolean> {
  const { playerId, gameId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );

  const players = await findAllPlayersForGame(gameId);

  const configuration = await findGameConfigurationById(gameId);
  if (Player.isCurrentUserHost(playerId, players)) {
    const game: Models.Game = {
      __typename: "Game",
      id: configuration.id,
      mapId: configuration.mapId,
      players: players.map(playerConfigurationToPlayer),
      neutralCountryTroops: generateRandomTroopCounts(),
      playerTurn: {
        __typename: "PlayerTurn",
        playerId: playerId,
        playerTurnStage: Models.PlayerTurnStage.CapitolPlacement
      }
    };

    await saveGame(game);
    PubSub.gameConfigurationChanged(pubSub);
    return true;
  } else {
    return false;
  }
}

function generateRandomTroopCounts(): Models.CountryTroopCounts[] {
  return [];
}

function playerConfigurationToPlayer(
  playerConfiguration: Player.PlayerConfiguration
): Models.GamePlayer {
  return {
    __typename: "GamePlayer",
    id: playerConfiguration.id,
    name: playerConfiguration.name,
    countryTroopCounts: [],
    color: playerConfiguration.color,
    ports: []
  };
}
