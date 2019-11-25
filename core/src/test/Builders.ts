import * as Models from "../Models";
import * as Uuid from "../Uuid";
import * as Color from "../models/Color";
import * as Player from "../models/Player";

// TODO: There can be collisions
export function uniqueId(): string {
  return Math.floor(Math.random() * 10000000).toString();
}

export type MapOptions = {
  name?: string;
  countries?: Array<Models.Country>;
  bodiesOfWater?: Array<Models.BodyOfWater>;
  dimensions?: Models.Dimensions;
};

export function playerToken(): Models.PlayerToken {
  return {
    __typename: "PlayerToken",
    playerToken: Uuid.generate(),
    playerId: uniqueId(),
    gameId: uniqueId()
  };
}

export function newGameConfiguration(): Models.NewGameConfiguration {
  return {
    mapId: Models.mapId("123", "default")
  };
}

export function map(options: MapOptions): Models.Map {
  return {
    id: Models.userMapId(Uuid.generate()),
    name: options.name || "Map " + Uuid.generate(),
    countries: [],
    bodiesOfWater: [],
    dimensions: { width: 0, height: 0 }
  };
}

export function playerConfiguration(): Player.PlayerConfiguration {
  return {
    id: uniqueId(),
    name: "Player " + Uuid.generate(),
    color: Color.black,
    gameId: uniqueId()
  };
}

export function newPlayerConfiguration(): Player.NewPlayerConfiguration {
  return {
    gameId: uniqueId(),
    name: "",
    color: Color.black
  };
}

export function game(id: string): Models.Game {
  return {
    __typename: "Game",
    players: [],
    mapId: Models.mapId("1", "user"),
    id,
    playerTurn: {
      __typename: "PlayerTurn",
      playerId: "1",
      playerTurnStage: Models.PlayerTurnStage.CapitolPlacement
    },
    neutralCountryTroops: []
  };
}

export function gameWithoutMap(id: string): Models.GameWithoutMap {
  return {
    players: [],
    id,
    playerTurn: {
      __typename: "PlayerTurn",
      playerId: "1",
      playerTurnStage: Models.PlayerTurnStage.CapitolPlacement
    },
    neutralCountryTroops: []
  };
}

export function gameToken(): Models.GameToken {
  return {
    gameId: uniqueId(),
    gameToken: Uuid.generate()
  };
}

export function generateUuid() {
  return Uuid.generate();
}
