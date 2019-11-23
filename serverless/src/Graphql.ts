// GENERATED: DO NOT EDIT BY HAND
export const typeDefs = `
### TODO: DELETE

type Message {
  id: ID!
  text: String!
  type: MessageType!
}

enum MessageType {
  greeting
  test
}

### MAP INPUT ###

input MapInput {
  name: String!
  countries: [CountryInput!]!
  bodiesOfWater: [BodyOfWaterInput!]!
  dimensions: DimensionsInput!
}

input DimensionsInput {
  width: Int!
  height: Int!
}

input CountryInput {
  id: String!
  coordinates: [PointInput!]!
  polygon: [PointInput!]!
  waterEdges: [SegmentInput!]!
  center: PointInput!
  neighboringCountries: [String!]!
  neighboringBodiesOfWater: [String!]!
}

input BodyOfWaterInput {
  id: String!
  neighboringCountries: [String!]!
}

input SegmentInput {
  point1: PointInput!
  point2: PointInput!
}

input PointInput {
  x: Int!
  y: Int!
}

### MAP ###

type Map {
  id: String!
  name: String!
  countries: [Country!]!
  bodiesOfWater: [BodyOfWater!]!
  dimensions: Dimensions!
}

type Country {
  id: String!
  coordinates: [Point!]!
  polygon: [Point!]!
  waterEdges: [Segment!]!
  center: Point!
  neighboringCountries: [String!]!
  neighboringBodiesOfWater: [String!]!
}

type Dimensions {
  width: Int!
  height: Int!
}

type BodyOfWater {
  id: String!
  neighboringCountries: [String!]!
}

type Point {
  x: Int!
  y: Int!
}

type Segment {
  point1: Point!
  point2: Point!
}

### GAME INPUT ###

input NewGameInput {
  mapId: String!
  mapIdType: String!
  players: [PlayerInput!]!
  neutralCountryTroops: [CountryTroopCountsInput!]!
  playerTurn: PlayerTurnInput!
}

input GameInput {
  id: String!
  players: [PlayerInput!]!
  neutralCountryTroops: [CountryTroopCountsInput!]!
  playerTurn: PlayerTurnInput!
}

input PlayerTurnInput {
  playerId: String!
  playerTurnStage: PlayerTurnStage!
  fromCountryId: String # Only for TroopMovementFromSelected
  troopCount: String # Only for TroopMovementFromSelected
}

input PlayerInput {
  id: String!
  name: String!
  countryTroopCounts: [CountryTroopCountsInput!]!
  capitol: String
  color: ColorInput!
  ports: [String!]!
}

input ColorInput {
  red: Int!
  green: Int!
  blue: Int!
}

input CountryTroopCountsInput {
  countryId: String!
  troopCount: Int!
}

### GAME ###

type Game {
  id: String!
  map: Map!
  players: [Player!]!
  neutralCountryTroops: [CountryTroopCounts!]!
  playerTurn: PlayerTurn!
  currentUserPlayerId: String!
}

type GameWithoutMap {
  id: String!
  players: [Player!]!
  neutralCountryTroops: [CountryTroopCounts!]!
  playerTurn: PlayerTurn!
  currentUserPlayerId: String!
}

type CountryTroopCounts {
  countryId: String!
  troopCount: Int!
}

type PlayerTurn {
  playerId: String!
  playerTurnStage: PlayerTurnStage!
  fromCountryId: String # Only for TroopMovementFromSelected
  troopCount: String # Only for TroopMovementFromSelected
}

type Color {
  red: Int!
  green: Int!
  blue: Int!
}

type Player {
  id: String!
  name: String!
  countryTroopCounts: [CountryTroopCounts!]!
  capitol: String
  color: Color!
  ports: [String!]!
}

enum PlayerTurnStage {
  CapitolPlacement
  TroopPlacement
  AttackAnnexOrPort
  TroopMovement
  TroopMovementFromSelected
  GameOver
}

union GameOrConfiguration = GameConfiguration | Game

type PlayerConfiguration {
  color: Color!
  playerId: String!
  name: String!
}

type GameConfiguration {
  id: String!
  players: [PlayerConfiguration!]!
  mapId: String!
  mapIdType: String!
  joinToken: String!
  currentUserPlayerId: String!
  isCurrentUserHost: Boolean!
}

type GameMap {
  mapId: String!
  mapIdType: String!
}

type Query {
  map(id: String!): Map!
  gameOrConfiguration(playerToken: String!): GameOrConfiguration!
  game(playerToken: String!): Game!
  maps: [Map!]!
}

type Mutation {
  sendMessage(text: String!, type: MessageType = greeting): Message! # TODO: Delete
  createGame: String! # Returns hostToken
  createMap(map: MapInput!): Map!
  joinGame(joinGameToken: String!): String! # Returns player token
  removePlayer(playerToken: String!, playerId: String!): Game! # Must be host
  saveGame(playerToken: String!, game: GameInput!): Boolean!
  startGame(playerToken: String!): Boolean! # Must be host
  updateGameMap(
    playerToken: String!
    mapId: String!
    mapIdType: String!
  ): Boolean!
  updateGamePlayerName(name: String!, playerToken: String!): Boolean! # Deprecated
  updateGamePlayerColor(color: ColorInput!, playerToken: String!): Boolean! # Deprecated
  updateGamePlayer(
    playerToken: String!
    color: ColorInput!
    name: String!
  ): Boolean!
}

type Subscription {
  messageFeed(type: MessageType): Message! # TODO: Delete
  game(playerToken: String!): GameWithoutMap!
  gameOrConfiguration(playerToken: String!): GameOrConfiguration! # Deprecated
  gamePlayerUpdate(playerToken: String!): PlayerConfiguration!
  gameMapUpdate(playerToken: String!): GameMap!
}
`;