import * as Models from "./Models";
import * as Player from "./models/Player";
import * as Color from "./models/Color";

export type CreateGameToken = (
  gameToken: string,
  gameId: string
) => Promise<void>;

export type CreateGameConfiguration = (
  newGameConfiguration: Models.NewGameConfiguration
) => Promise<string>;

export type CreatePlayerConfiguration = (
  newPlayer: Player.NewPlayerConfiguration
) => Promise<Player.PlayerConfiguration>;

export type CreatePlayerToken = (
  playerToken: string,
  playerId: string,
  gameId: string
) => Promise<Models.PlayerToken>;

export type CreateMap = (newMap: Models.NewMap) => Promise<Models.Map>;

export type FindAllMaps = () => Promise<Models.Map[]>;

export type FindAllPlayersForGame = (
  gameId: string
) => Promise<Player.PlayerConfiguration[]>;

export type FindGameIdByToken = (gameToken: string) => Promise<string>;

export type FindGameIdAndPlayerIdByToken = (
  playerToken: string
) => Promise<{ gameId: string; playerId: string }>;

export type FindGameTokenByGameId = (gameId: string) => Promise<string>;

export type FindMapById = (id: Models.UserMapId) => Promise<Models.Map>;

export type FindGameById = (id: string) => Promise<Models.Game>;

export type FindGameConfigurationById = (
  id: string
) => Promise<Models.GameConfiguration>;

export type UpdateGame = (game: Models.Game) => Promise<void>;

export type UpdateGameMap = (
  id: string,
  mapId: Models.MapId
) => Promise<boolean>;

export type UpdateGameWithoutMap = (
  game: Models.GameWithoutMap
) => Promise<void>;

export type UpdatePlayerName = (
  playerId: string,
  gameId: string,
  name: string
) => Promise<void>;
export type UpdatePlayerColor = (
  playerId: string,
  gameId: string,
  color: Color.Color
) => Promise<void>;

export type Repository = {
  createGameConfiguration: CreateGameConfiguration;
  createPlayerConfiguration: CreatePlayerConfiguration;
  createPlayerToken: CreatePlayerToken;
  createGameToken: CreateGameToken;
  createMap: CreateMap;
  findAllMaps: FindAllMaps;
  findAllPlayersForGame: FindAllPlayersForGame;
  findMapById: FindMapById;
  findGameIdAndPlayerIdByToken: FindGameIdAndPlayerIdByToken;
  findGameIdByToken: FindGameIdByToken;
  findGameTokenByGameId: FindGameTokenByGameId;
  findGameById: FindGameById;
  findGameConfigurationById: FindGameConfigurationById;
  updateGameMap: UpdateGameMap;
  updateGame: UpdateGame;
  updatePlayerColor: UpdatePlayerColor;
  updatePlayerName: UpdatePlayerName;
  updateGameWithoutMap: UpdateGameWithoutMap;
};
