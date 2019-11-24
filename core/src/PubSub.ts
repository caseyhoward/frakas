import * as Models from "./Models";
import { SubscriptionResolveFn } from "./api/graphql";

export enum Message {
  INTERNET_GAME_CHANGED = "INTERNET_GAME_CHANGED",
  INTERNET_GAME_CONFIGURATION_CHANGED = "INTERNET_GAME_CONFIGURATION_CHANGED"
}

export type PubSub = {
  publish: (eventName: string, payload: any) => boolean;
  subscribe: (eventName: string) => SubscriptionResolveFn<any, any, any, any>;
};

export function subscribeGame(
  pubSub: PubSub
): SubscriptionResolveFn<any, any, any, any> {
  return pubSub.subscribe(Message.INTERNET_GAME_CHANGED);
}

export function subscribeTest(
  pubSub: PubSub
): SubscriptionResolveFn<any, any, any, any> {
  return pubSub.subscribe("TEST");
}

export function subscribeGameConfiguration(
  pubSub: PubSub
): SubscriptionResolveFn<any, any, any, any> {
  console.log("subscribe game configuration");
  return pubSub.subscribe(Message.INTERNET_GAME_CONFIGURATION_CHANGED);
}

export function gameChanged(
  pubSub: PubSub,
  game: Models.GameWithoutMap,
  playerId: string
) {
  const message = {
    game: Models.gameWithoutMapToGraphql(game, playerId)
  };
  console.log("publish game changed");
  pubSub.publish(Message.INTERNET_GAME_CHANGED, message);
}

export function gameConfigurationChanged(pubSub: PubSub) {
  console.log("game configuration changed");
  pubSub.publish(Message.INTERNET_GAME_CONFIGURATION_CHANGED, {});
}

// export type SubscriptionResolver = (
//   rootValue: any,
//   args: any,
//   context: any,
//   info: any
// ) => Promise<AsyncIterator<any>> | AsyncIterator<any>;
