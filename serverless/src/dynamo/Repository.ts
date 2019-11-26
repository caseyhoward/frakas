import * as Table from "./Table";
import * as Models from "fracas-core/src/Models";
import * as Player from "fracas-core/src/models/Player";
import * as Color from "fracas-core/src/models/Color";
import * as MapRepository from "./repositories/MapRepository";
import * as GameRepository from "./repositories/GameRepository";
import * as GameConfigurationRepository from "./repositories/GameConfigurationRepository";
import * as PlayerTokenRepository from "./repositories/PlayerTokenRepository";
import * as GameTokenRepository from "./repositories/GameTokenRepository";
import * as PlayerConfigurationRepository from "./repositories/PlayerConfigurationRepository";
import * as Repository from "fracas-core/src/Repository";
import * as Database from "./Database";

export function create(
  tableName: string,
  database: Database.Database
): Repository.Repository {
  const table: Table.Table = { tableName, database };

  return {
    createGameConfiguration: (configuration: Models.NewGameConfiguration) =>
      GameConfigurationRepository.create(table, configuration),
    createPlayerConfiguration: (newPlayer: Player.NewPlayerConfiguration) =>
      PlayerConfigurationRepository.create(table, newPlayer),
    createPlayerToken: (playerToken, playerId, gameId) =>
      PlayerTokenRepository.create(table, playerToken, playerId, gameId),
    createGameToken: (gameToken, gameId) =>
      GameTokenRepository.create(table, gameToken, gameId),
    createMap: (newMap: Models.NewMap) => MapRepository.create(table, newMap),
    findAllMaps: () => MapRepository.findAll(table),
    findAllPlayersForGame: (gameId: string) =>
      PlayerConfigurationRepository.findAllByGameId(table, gameId),
    findGameTokenByGameId: (gameId: string) =>
      GameTokenRepository.findGameTokenByGameId(table, gameId),
    findGameIdAndPlayerIdByToken: (playerToken: string) =>
      PlayerTokenRepository.findByToken(table, playerToken),
    findMapById: (id: Models.UserMapId) => MapRepository.findById(table, id),
    findGameConfigurationById: (id: string) =>
      GameConfigurationRepository.findById(table, id),
    findGameById: (id: string) => GameRepository.findById(table, id),
    findGameIdByToken: gameToken =>
      GameTokenRepository.findGameIdByToken(table, gameToken),
    updatePlayerName: (playerId: string, gameId: string, name: string) =>
      PlayerConfigurationRepository.updateName(table, playerId, gameId, name),
    updatePlayerColor: (playerId: string, gameId: string, color: Color.Color) =>
      PlayerConfigurationRepository.updateColor(table, playerId, gameId, color),
    updateGame: (game: Models.Game) => GameRepository.save(table, game),
    updateGameMap: (id: string, mapId: Models.MapId) =>
      GameConfigurationRepository.updateMap(table, id, mapId),
    updateGameWithoutMap: (game: Models.GameWithoutMap) =>
      GameRepository.saveWithoutMap(table, game),
    updateGamePlayer: (player: Player.PlayerConfiguration) =>
      PlayerConfigurationRepository.update(table, player)
  };
}
