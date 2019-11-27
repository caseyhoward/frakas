import * as Models from "./Models";
import * as Player from "./models/Player";
import { SubscriptionResolveFn } from "./api/graphql";
import * as Repository from "./Repository";
import * as graphql from "./api/graphql";

export enum Message {
  INTERNET_GAME_CHANGED = "INTERNET_GAME_CHANGED",
  INTERNET_GAME_CONFIGURATION_CHANGED = "INTERNET_GAME_CONFIGURATION_CHANGED",
  GAME_PLAYER_UPDATE = "GAME_PLAYER_UPDATE"
}

export type FilterFn = (
  rootValue?: any,
  args?: any,
  context?: any,
  info?: any
) => boolean | Promise<boolean>;

export type PubSub = {
  publish: (eventName: string, payload: any) => boolean;
  subscribe: (eventName: string) => SubscriptionResolveFn<any, any, any, any>;
  withFilter: (
    asyncIteratorFn: SubscriptionResolveFn<any, any, any, any>,
    filterFn: FilterFn
  ) => SubscriptionResolveFn<any, any, any, any>;
};

export function subscribeGame(
  pubSub: PubSub
): SubscriptionResolveFn<any, any, any, any> {
  return pubSub.subscribe(Message.INTERNET_GAME_CHANGED);
}

export function subscribeGameConfiguration(
  pubSub: PubSub
): SubscriptionResolveFn<any, any, any, any> {
  return pubSub.subscribe(Message.INTERNET_GAME_CONFIGURATION_CHANGED);
}

export function subscribeGamePlayerUpdate(
  pubSub: PubSub,
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken
): SubscriptionResolveFn<any, any, any, any> {
  return pubSub.withFilter(
    pubSub.subscribe(Message.GAME_PLAYER_UPDATE),
    (
      payload: Player.PlayerConfiguration,
      input: graphql.SubscriptionGamePlayerUpdateArgs
    ) => {
      return findGameIdAndPlayerIdByToken(input.playerToken).then(
        ({ gameId }) => {
          console.log("gameId", gameId);
          return payload.gameId === gameId;
        }
      );
    }
  );
}

export function gameChanged(
  pubSub: PubSub,
  game: Models.GameWithoutMap,
  playerId: string
) {
  const message = {
    game: Models.gameWithoutMapToGraphql(game, playerId)
  };
  pubSub.publish(Message.INTERNET_GAME_CHANGED, message);
}

export function gameConfigurationChanged(pubSub: PubSub) {
  pubSub.publish(Message.INTERNET_GAME_CONFIGURATION_CHANGED, {});
}

export function gamePlayerUpdated(
  pubSub: PubSub,
  gamePlayer: Player.PlayerConfiguration
) {
  pubSub.publish(Message.GAME_PLAYER_UPDATE, gamePlayer);
}
