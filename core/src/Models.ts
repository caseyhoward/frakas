/*************
 * MAP
 *************/

import * as Graphql from "./api/graphql";
import * as Player from "./models/Player";
import * as Color from "./models/Color";

export type BodyOfWater = {
  __typename?: "BodyOfWater";
  id: string;
  neighboringCountries: Array<string>;
};

export type Country = {
  __typename?: "Country";
  id: string;
  coordinates: Array<Point>;
  polygon: Array<Point>;
  waterEdges: Array<Segment>;
  center: Point;
  neighboringCountries: Array<string>;
  neighboringBodiesOfWater: Array<string>;
};

export type Dimensions = {
  __typename?: "Dimensions";
  width: number;
  height: number;
};

export type Map = {
  __typename?: "Map";
  id: UserMapId;
  name: string;
  countries: Array<Country>;
  bodiesOfWater: Array<BodyOfWater>;
  dimensions: Dimensions;
};

export type NewMap = {
  name: string;
  countries: Array<Country>;
  bodiesOfWater: Array<BodyOfWater>;
  dimensions: Dimensions;
};

export type Point = {
  __typename?: "Point";
  x: number;
  y: number;
};

export type Segment = {
  __typename?: "Segment";
  point1: Point;
  point2: Point;
};

/*************
 * GAME
 *************/

export type GameOrConfiguration = GameConfiguration | Game;

export type GameConfiguration = {
  id: string;
  mapId: MapId;
};

export type GameStatusJson = {
  __typename: "PlayingJson";
  players: Array<GamePlayer>;
  neutralCountryTroops: Array<CountryTroopCounts>;
  playerTurn: PlayerTurn;
};

export type NewGameConfiguration = {
  // host: Player.PlayerConfiguration;
  mapId: MapId;
};

export type CountryTroopCounts = {
  __typename: "CountryTroopCounts";
  countryId: string;
  troopCount: number;
};

export type PlayerToken = {
  __typename: "PlayerToken";
  playerToken: string;
  playerId: string;
  gameId: string;
};

export type GamePlayer = {
  __typename: "GamePlayer";
  id: string;
  name: string;
  color: Color.Color;
  countryTroopCounts: Array<CountryTroopCounts>;
  capitol?: string;
  ports: string[];
};

export type NewGame = {
  __typename: "NewGame";
  mapId: MapId;
  players: Array<GamePlayer>;
  neutralCountryTroops: Array<CountryTroopCounts>;
  playerTurn: PlayerTurn;
};

export type UserMapId = {
  __typename: "UserMapId";
  value: string;
};

export function mapId(id: string, typeName: "user" | "default"): MapId {
  switch (typeName) {
    case "user":
      return {
        __typename: "UserMapId",
        value: id
      };
      break;
    case "default":
      return {
        __typename: "DefaultMapId",
        value: id
      };
  }
}

export function userMapId(id: string): UserMapId {
  return {
    __typename: "UserMapId",
    value: id
  };
}

export type DefaultMapId = {
  __typename: "DefaultMapId";
  value: string;
};

export type MapId = UserMapId | DefaultMapId;

export type Game = {
  __typename: "Game";
  id: string;
  mapId: MapId;
  players: Array<GamePlayer>;
  neutralCountryTroops: Array<CountryTroopCounts>;
  playerTurn: PlayerTurn;
};

export type GameWithoutMap = {
  id: string;
  players: Array<GamePlayer>;
  neutralCountryTroops: Array<CountryTroopCounts>;
  playerTurn: PlayerTurn;
};

export type PlayerTurn = {
  __typename: "PlayerTurn";
  playerId: string;
  playerTurnStage: PlayerTurnStage;
  fromCountryId?: string;
  troopCount?: string;
};

export enum PlayerTurnStage {
  CapitolPlacement = "CapitolPlacement",
  TroopPlacement = "TroopPlacement",
  AttackAnnexOrPort = "AttackAnnexOrPort",
  TroopMovement = "TroopMovement",
  TroopMovementFromSelected = "TroopMovementFromSelected",
  GameOver = "GameOver"
}

export type GameToken = {
  gameId: string;
  gameToken: string;
};

export function gameConfigurationToGraphQl(
  currentUserPlayerId: string,
  players: Player.PlayerConfiguration[],
  configuration: GameConfiguration,
  joinToken: string
): Graphql.GameConfiguration {
  return {
    __typename: "GameConfiguration",
    id: configuration.id,
    // TODO: Reuse logic in Player module
    players: players.map(player => {
      return {
        ...player,
        __typename: "PlayerConfiguration",
        playerId: player.id
      };
    }),
    mapId: configuration.mapId.value,
    mapIdType: mapIdTypeString(configuration.mapId),
    joinToken: joinToken,
    currentUserPlayerId: currentUserPlayerId,
    isCurrentUserHost: Player.isCurrentUserHost(currentUserPlayerId, players)
  };
}

export function gameToGraphql(
  game: Game,
  currentUserPlayerId: string
): Graphql.Game {
  return {
    __typename: "Game",
    id: game.id.toString(),
    currentUserPlayerId: currentUserPlayerId,
    map: <any>{ id: game.mapId.value },
    neutralCountryTroops: game.neutralCountryTroops,
    playerTurn: {
      ...game.playerTurn,
      playerId: game.playerTurn.playerId.toString()
    },
    players: game.players.map(gamePlayer =>
      gamePlayerToGraphql(gamePlayer, game.players)
    )
  };
}

export function gameWithoutMapToGraphql(
  game: GameWithoutMap,
  currentUserPlayerId: string
): Graphql.GameWithoutMap {
  return {
    __typename: "GameWithoutMap",
    id: game.id.toString(),
    currentUserPlayerId: currentUserPlayerId,
    neutralCountryTroops: game.neutralCountryTroops,
    playerTurn: {
      ...game.playerTurn,
      playerId: game.playerTurn.playerId.toString()
    },
    players: game.players.map(gamePlayer =>
      gamePlayerToGraphql(gamePlayer, game.players)
    )
  };
}

export function gamePlayerToGraphql(
  gamePlayer: GamePlayer,
  players: GamePlayer[]
): Graphql.Player {
  const player = players.find(player => player.id === gamePlayer.id);
  if (player) {
    return {
      ...gamePlayer,
      __typename: "Player",
      id: player.id.toString(),
      name: player.name,
      color: player.color
    };
  } else {
    throw "Invalid player";
  }
}

export function mapIdTypeString(mapId: MapId): string {
  switch (mapId.__typename) {
    case "UserMapId":
      return "user";
    case "DefaultMapId":
      return "default";
  }
}

export function mapToGraphql(map: Map): Graphql.Map {
  return { ...map, id: map.id.value };
}
