import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type BodyOfWater = {
   __typename?: 'BodyOfWater',
  id: Scalars['String'],
  neighboringCountries: Array<Scalars['String']>,
};

export type BodyOfWaterInput = {
  id: Scalars['String'],
  neighboringCountries: Array<Scalars['String']>,
};

export type Color = {
   __typename?: 'Color',
  red: Scalars['Int'],
  green: Scalars['Int'],
  blue: Scalars['Int'],
};

export type ColorInput = {
  red: Scalars['Int'],
  green: Scalars['Int'],
  blue: Scalars['Int'],
};

export type Country = {
   __typename?: 'Country',
  id: Scalars['String'],
  coordinates: Array<Point>,
  polygon: Array<Point>,
  waterEdges: Array<Segment>,
  center: Point,
  neighboringCountries: Array<Scalars['String']>,
  neighboringBodiesOfWater: Array<Scalars['String']>,
};

export type CountryInput = {
  id: Scalars['String'],
  coordinates: Array<PointInput>,
  polygon: Array<PointInput>,
  waterEdges: Array<SegmentInput>,
  center: PointInput,
  neighboringCountries: Array<Scalars['String']>,
  neighboringBodiesOfWater: Array<Scalars['String']>,
};

export type CountryTroopCounts = {
   __typename?: 'CountryTroopCounts',
  countryId: Scalars['String'],
  troopCount: Scalars['Int'],
};

export type CountryTroopCountsInput = {
  countryId: Scalars['String'],
  troopCount: Scalars['Int'],
};

export type Dimensions = {
   __typename?: 'Dimensions',
  width: Scalars['Int'],
  height: Scalars['Int'],
};

export type DimensionsInput = {
  width: Scalars['Int'],
  height: Scalars['Int'],
};

export type Game = {
   __typename?: 'Game',
  id: Scalars['String'],
  map: Map,
  players: Array<Player>,
  neutralCountryTroops: Array<CountryTroopCounts>,
  playerTurn: PlayerTurn,
  currentUserPlayerId: Scalars['String'],
};

export type GameConfiguration = {
   __typename?: 'GameConfiguration',
  id: Scalars['String'],
  players: Array<PlayerConfiguration>,
  mapId: Scalars['String'],
  mapIdType: Scalars['String'],
  joinToken: Scalars['String'],
  currentUserPlayerId: Scalars['String'],
  isCurrentUserHost: Scalars['Boolean'],
};

export type GameInput = {
  id: Scalars['String'],
  players: Array<PlayerInput>,
  neutralCountryTroops: Array<CountryTroopCountsInput>,
  playerTurn: PlayerTurnInput,
};

export type GameMap = {
   __typename?: 'GameMap',
  mapId: Scalars['String'],
  mapIdType: Scalars['String'],
};

export type GameOrConfiguration = GameConfiguration | Game;

export type GameWithoutMap = {
   __typename?: 'GameWithoutMap',
  id: Scalars['String'],
  players: Array<Player>,
  neutralCountryTroops: Array<CountryTroopCounts>,
  playerTurn: PlayerTurn,
  currentUserPlayerId: Scalars['String'],
};

export type Map = {
   __typename?: 'Map',
  id: Scalars['String'],
  name: Scalars['String'],
  countries: Array<Country>,
  bodiesOfWater: Array<BodyOfWater>,
  dimensions: Dimensions,
};

export type MapInput = {
  name: Scalars['String'],
  countries: Array<CountryInput>,
  bodiesOfWater: Array<BodyOfWaterInput>,
  dimensions: DimensionsInput,
};

export type Message = {
   __typename?: 'Message',
  id: Scalars['ID'],
  text: Scalars['String'],
  type: MessageType,
};

export enum MessageType {
  Greeting = 'greeting',
  Test = 'test'
}

export type Mutation = {
   __typename?: 'Mutation',
  sendMessage: Message,
  createGame: Scalars['String'],
  createMap: Map,
  joinGame: Scalars['String'],
  removePlayer: Game,
  saveGame: Scalars['Boolean'],
  startGame: Scalars['Boolean'],
  updateGameMap: Scalars['Boolean'],
  updateGamePlayerName: Scalars['Boolean'],
  updateGamePlayerColor: Scalars['Boolean'],
  updateGamePlayer: Scalars['Boolean'],
};


export type MutationSendMessageArgs = {
  text: Scalars['String'],
  type?: Maybe<MessageType>
};


export type MutationCreateMapArgs = {
  map: MapInput
};


export type MutationJoinGameArgs = {
  joinGameToken: Scalars['String']
};


export type MutationRemovePlayerArgs = {
  playerToken: Scalars['String'],
  playerId: Scalars['String']
};


export type MutationSaveGameArgs = {
  playerToken: Scalars['String'],
  game: GameInput
};


export type MutationStartGameArgs = {
  playerToken: Scalars['String']
};


export type MutationUpdateGameMapArgs = {
  playerToken: Scalars['String'],
  mapId: Scalars['String'],
  mapIdType: Scalars['String']
};


export type MutationUpdateGamePlayerNameArgs = {
  name: Scalars['String'],
  playerToken: Scalars['String']
};


export type MutationUpdateGamePlayerColorArgs = {
  color: ColorInput,
  playerToken: Scalars['String']
};


export type MutationUpdateGamePlayerArgs = {
  playerToken: Scalars['String'],
  color: ColorInput,
  name: Scalars['String']
};

export type NewGameInput = {
  mapId: Scalars['String'],
  mapIdType: Scalars['String'],
  players: Array<PlayerInput>,
  neutralCountryTroops: Array<CountryTroopCountsInput>,
  playerTurn: PlayerTurnInput,
};

export type Player = {
   __typename?: 'Player',
  id: Scalars['String'],
  name: Scalars['String'],
  countryTroopCounts: Array<CountryTroopCounts>,
  capitol?: Maybe<Scalars['String']>,
  color: Color,
  ports: Array<Scalars['String']>,
};

export type PlayerConfiguration = {
   __typename?: 'PlayerConfiguration',
  color: Color,
  playerId: Scalars['String'],
  name: Scalars['String'],
};

export type PlayerInput = {
  id: Scalars['String'],
  name: Scalars['String'],
  countryTroopCounts: Array<CountryTroopCountsInput>,
  capitol?: Maybe<Scalars['String']>,
  color: ColorInput,
  ports: Array<Scalars['String']>,
};

export type PlayerTurn = {
   __typename?: 'PlayerTurn',
  playerId: Scalars['String'],
  playerTurnStage: PlayerTurnStage,
  fromCountryId?: Maybe<Scalars['String']>,
  troopCount?: Maybe<Scalars['String']>,
};

export type PlayerTurnInput = {
  playerId: Scalars['String'],
  playerTurnStage: PlayerTurnStage,
  fromCountryId?: Maybe<Scalars['String']>,
  troopCount?: Maybe<Scalars['String']>,
};

export enum PlayerTurnStage {
  CapitolPlacement = 'CapitolPlacement',
  TroopPlacement = 'TroopPlacement',
  AttackAnnexOrPort = 'AttackAnnexOrPort',
  TroopMovement = 'TroopMovement',
  TroopMovementFromSelected = 'TroopMovementFromSelected',
  GameOver = 'GameOver'
}

export type Point = {
   __typename?: 'Point',
  x: Scalars['Int'],
  y: Scalars['Int'],
};

export type PointInput = {
  x: Scalars['Int'],
  y: Scalars['Int'],
};

export type Query = {
   __typename?: 'Query',
  map: Map,
  gameOrConfiguration: GameOrConfiguration,
  game: Game,
  maps: Array<Map>,
};


export type QueryMapArgs = {
  id: Scalars['String']
};


export type QueryGameOrConfigurationArgs = {
  playerToken: Scalars['String']
};


export type QueryGameArgs = {
  playerToken: Scalars['String']
};

export type Segment = {
   __typename?: 'Segment',
  point1: Point,
  point2: Point,
};

export type SegmentInput = {
  point1: PointInput,
  point2: PointInput,
};

export type Subscription = {
   __typename?: 'Subscription',
  messageFeed: Message,
  game: GameWithoutMap,
  gameOrConfiguration: GameOrConfiguration,
  gamePlayerUpdate: PlayerConfiguration,
  gameMapUpdate: GameMap,
};


export type SubscriptionMessageFeedArgs = {
  type?: Maybe<MessageType>
};


export type SubscriptionGameArgs = {
  playerToken: Scalars['String']
};


export type SubscriptionGameOrConfigurationArgs = {
  playerToken: Scalars['String']
};


export type SubscriptionGamePlayerUpdateArgs = {
  playerToken: Scalars['String']
};


export type SubscriptionGameMapUpdateArgs = {
  playerToken: Scalars['String']
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Map: ResolverTypeWrapper<Map>,
  Country: ResolverTypeWrapper<Country>,
  Point: ResolverTypeWrapper<Point>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Segment: ResolverTypeWrapper<Segment>,
  BodyOfWater: ResolverTypeWrapper<BodyOfWater>,
  Dimensions: ResolverTypeWrapper<Dimensions>,
  GameOrConfiguration: ResolversTypes['GameConfiguration'] | ResolversTypes['Game'],
  GameConfiguration: ResolverTypeWrapper<GameConfiguration>,
  PlayerConfiguration: ResolverTypeWrapper<PlayerConfiguration>,
  Color: ResolverTypeWrapper<Color>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Game: ResolverTypeWrapper<Game>,
  Player: ResolverTypeWrapper<Player>,
  CountryTroopCounts: ResolverTypeWrapper<CountryTroopCounts>,
  PlayerTurn: ResolverTypeWrapper<PlayerTurn>,
  PlayerTurnStage: PlayerTurnStage,
  Mutation: ResolverTypeWrapper<{}>,
  MessageType: MessageType,
  Message: ResolverTypeWrapper<Message>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  MapInput: MapInput,
  CountryInput: CountryInput,
  PointInput: PointInput,
  SegmentInput: SegmentInput,
  BodyOfWaterInput: BodyOfWaterInput,
  DimensionsInput: DimensionsInput,
  GameInput: GameInput,
  PlayerInput: PlayerInput,
  CountryTroopCountsInput: CountryTroopCountsInput,
  ColorInput: ColorInput,
  PlayerTurnInput: PlayerTurnInput,
  Subscription: ResolverTypeWrapper<{}>,
  GameWithoutMap: ResolverTypeWrapper<GameWithoutMap>,
  GameMap: ResolverTypeWrapper<GameMap>,
  NewGameInput: NewGameInput,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  Map: Map,
  Country: Country,
  Point: Point,
  Int: Scalars['Int'],
  Segment: Segment,
  BodyOfWater: BodyOfWater,
  Dimensions: Dimensions,
  GameOrConfiguration: ResolversParentTypes['GameConfiguration'] | ResolversParentTypes['Game'],
  GameConfiguration: GameConfiguration,
  PlayerConfiguration: PlayerConfiguration,
  Color: Color,
  Boolean: Scalars['Boolean'],
  Game: Game,
  Player: Player,
  CountryTroopCounts: CountryTroopCounts,
  PlayerTurn: PlayerTurn,
  PlayerTurnStage: PlayerTurnStage,
  Mutation: {},
  MessageType: MessageType,
  Message: Message,
  ID: Scalars['ID'],
  MapInput: MapInput,
  CountryInput: CountryInput,
  PointInput: PointInput,
  SegmentInput: SegmentInput,
  BodyOfWaterInput: BodyOfWaterInput,
  DimensionsInput: DimensionsInput,
  GameInput: GameInput,
  PlayerInput: PlayerInput,
  CountryTroopCountsInput: CountryTroopCountsInput,
  ColorInput: ColorInput,
  PlayerTurnInput: PlayerTurnInput,
  Subscription: {},
  GameWithoutMap: GameWithoutMap,
  GameMap: GameMap,
  NewGameInput: NewGameInput,
};

export type BodyOfWaterResolvers<ContextType = any, ParentType extends ResolversParentTypes['BodyOfWater'] = ResolversParentTypes['BodyOfWater']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  neighboringCountries?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
};

export type ColorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Color'] = ResolversParentTypes['Color']> = {
  red?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  green?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  blue?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  coordinates?: Resolver<Array<ResolversTypes['Point']>, ParentType, ContextType>,
  polygon?: Resolver<Array<ResolversTypes['Point']>, ParentType, ContextType>,
  waterEdges?: Resolver<Array<ResolversTypes['Segment']>, ParentType, ContextType>,
  center?: Resolver<ResolversTypes['Point'], ParentType, ContextType>,
  neighboringCountries?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  neighboringBodiesOfWater?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
};

export type CountryTroopCountsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CountryTroopCounts'] = ResolversParentTypes['CountryTroopCounts']> = {
  countryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  troopCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type DimensionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dimensions'] = ResolversParentTypes['Dimensions']> = {
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  map?: Resolver<ResolversTypes['Map'], ParentType, ContextType>,
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>,
  neutralCountryTroops?: Resolver<Array<ResolversTypes['CountryTroopCounts']>, ParentType, ContextType>,
  playerTurn?: Resolver<ResolversTypes['PlayerTurn'], ParentType, ContextType>,
  currentUserPlayerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type GameConfigurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameConfiguration'] = ResolversParentTypes['GameConfiguration']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  players?: Resolver<Array<ResolversTypes['PlayerConfiguration']>, ParentType, ContextType>,
  mapId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  mapIdType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  joinToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  currentUserPlayerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isCurrentUserHost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
};

export type GameMapResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameMap'] = ResolversParentTypes['GameMap']> = {
  mapId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  mapIdType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type GameOrConfigurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameOrConfiguration'] = ResolversParentTypes['GameOrConfiguration']> = {
  __resolveType: TypeResolveFn<'GameConfiguration' | 'Game', ParentType, ContextType>
};

export type GameWithoutMapResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameWithoutMap'] = ResolversParentTypes['GameWithoutMap']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>,
  neutralCountryTroops?: Resolver<Array<ResolversTypes['CountryTroopCounts']>, ParentType, ContextType>,
  playerTurn?: Resolver<ResolversTypes['PlayerTurn'], ParentType, ContextType>,
  currentUserPlayerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MapResolvers<ContextType = any, ParentType extends ResolversParentTypes['Map'] = ResolversParentTypes['Map']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  countries?: Resolver<Array<ResolversTypes['Country']>, ParentType, ContextType>,
  bodiesOfWater?: Resolver<Array<ResolversTypes['BodyOfWater']>, ParentType, ContextType>,
  dimensions?: Resolver<ResolversTypes['Dimensions'], ParentType, ContextType>,
};

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['MessageType'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  sendMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'text' | 'type'>>,
  createGame?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  createMap?: Resolver<ResolversTypes['Map'], ParentType, ContextType, RequireFields<MutationCreateMapArgs, 'map'>>,
  joinGame?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationJoinGameArgs, 'joinGameToken'>>,
  removePlayer?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationRemovePlayerArgs, 'playerToken' | 'playerId'>>,
  saveGame?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveGameArgs, 'playerToken' | 'game'>>,
  startGame?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationStartGameArgs, 'playerToken'>>,
  updateGameMap?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateGameMapArgs, 'playerToken' | 'mapId' | 'mapIdType'>>,
  updateGamePlayerName?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateGamePlayerNameArgs, 'name' | 'playerToken'>>,
  updateGamePlayerColor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateGamePlayerColorArgs, 'color' | 'playerToken'>>,
  updateGamePlayer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateGamePlayerArgs, 'playerToken' | 'color' | 'name'>>,
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  countryTroopCounts?: Resolver<Array<ResolversTypes['CountryTroopCounts']>, ParentType, ContextType>,
  capitol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  color?: Resolver<ResolversTypes['Color'], ParentType, ContextType>,
  ports?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
};

export type PlayerConfigurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerConfiguration'] = ResolversParentTypes['PlayerConfiguration']> = {
  color?: Resolver<ResolversTypes['Color'], ParentType, ContextType>,
  playerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type PlayerTurnResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerTurn'] = ResolversParentTypes['PlayerTurn']> = {
  playerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  playerTurnStage?: Resolver<ResolversTypes['PlayerTurnStage'], ParentType, ContextType>,
  fromCountryId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  troopCount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type PointResolvers<ContextType = any, ParentType extends ResolversParentTypes['Point'] = ResolversParentTypes['Point']> = {
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  map?: Resolver<ResolversTypes['Map'], ParentType, ContextType, RequireFields<QueryMapArgs, 'id'>>,
  gameOrConfiguration?: Resolver<ResolversTypes['GameOrConfiguration'], ParentType, ContextType, RequireFields<QueryGameOrConfigurationArgs, 'playerToken'>>,
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<QueryGameArgs, 'playerToken'>>,
  maps?: Resolver<Array<ResolversTypes['Map']>, ParentType, ContextType>,
};

export type SegmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Segment'] = ResolversParentTypes['Segment']> = {
  point1?: Resolver<ResolversTypes['Point'], ParentType, ContextType>,
  point2?: Resolver<ResolversTypes['Point'], ParentType, ContextType>,
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  messageFeed?: SubscriptionResolver<ResolversTypes['Message'], "messageFeed", ParentType, ContextType, SubscriptionMessageFeedArgs>,
  game?: SubscriptionResolver<ResolversTypes['GameWithoutMap'], "game", ParentType, ContextType, RequireFields<SubscriptionGameArgs, 'playerToken'>>,
  gameOrConfiguration?: SubscriptionResolver<ResolversTypes['GameOrConfiguration'], "gameOrConfiguration", ParentType, ContextType, RequireFields<SubscriptionGameOrConfigurationArgs, 'playerToken'>>,
  gamePlayerUpdate?: SubscriptionResolver<ResolversTypes['PlayerConfiguration'], "gamePlayerUpdate", ParentType, ContextType, RequireFields<SubscriptionGamePlayerUpdateArgs, 'playerToken'>>,
  gameMapUpdate?: SubscriptionResolver<ResolversTypes['GameMap'], "gameMapUpdate", ParentType, ContextType, RequireFields<SubscriptionGameMapUpdateArgs, 'playerToken'>>,
};

export type Resolvers<ContextType = any> = {
  BodyOfWater?: BodyOfWaterResolvers<ContextType>,
  Color?: ColorResolvers<ContextType>,
  Country?: CountryResolvers<ContextType>,
  CountryTroopCounts?: CountryTroopCountsResolvers<ContextType>,
  Dimensions?: DimensionsResolvers<ContextType>,
  Game?: GameResolvers<ContextType>,
  GameConfiguration?: GameConfigurationResolvers<ContextType>,
  GameMap?: GameMapResolvers<ContextType>,
  GameOrConfiguration?: GameOrConfigurationResolvers,
  GameWithoutMap?: GameWithoutMapResolvers<ContextType>,
  Map?: MapResolvers<ContextType>,
  Message?: MessageResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Player?: PlayerResolvers<ContextType>,
  PlayerConfiguration?: PlayerConfigurationResolvers<ContextType>,
  PlayerTurn?: PlayerTurnResolvers<ContextType>,
  Point?: PointResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Segment?: SegmentResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
