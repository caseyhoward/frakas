import * as Color from "./Color";

export const allowedColors = [
  Color.lightGreen,
  Color.lightYellow,
  Color.darkGreen,
  Color.orange,
  Color.brown,
  Color.lightPurple,
  Color.green,
  Color.lightBlue,
  Color.lightGray,
  Color.gray,
  Color.darkGray,
  Color.charcoal,
  Color.lightBrown,
  Color.darkCharcoal,
  Color.lightOrange,
  Color.darkRed,
  Color.darkOrange,
  Color.purple,
  Color.darkBrown,
  Color.darkPurple,
  Color.lightRed,
  Color.red,
  Color.darkYellow,
  Color.yellow,
  Color.white
];

export function getNextAvailablePlayerColor(
  players: PlayerConfiguration[]
): Color.Color {
  const playerColors = players.map(player => player.color);
  const availableColor = allowedColors.find(
    color =>
      !playerColors.find(playerColor => Color.isEqual(color, playerColor))
  );
  if (availableColor) {
    return availableColor;
  } else {
    throw "All colors used. There must be a bug checking for too many players.";
  }
}

export type PlayerConfiguration = {
  id: string;
  gameId: string;
  name: string;
  color: Color.Color;
};

export type NewPlayerConfiguration = {
  gameId: string;
  name: string;
  color: Color.Color;
};

export function buildHost(gameId: string): NewPlayerConfiguration {
  return {
    gameId: gameId,
    color: defaultHostColor,
    name: "Host"
  };
}

export function isCurrentUserHost(
  playerId: string,
  players: PlayerConfiguration[]
): boolean {
  return players[0].id === playerId;
}

const defaultHostColor: Color.Color = Color.lightGreen;
