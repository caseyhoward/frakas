import * as Graphql from "../../api/graphql";
import * as PubSub from "../../PubSub";
import * as Repository from "../../Repository";

export default async function updatePlayerName(
  pubSub: PubSub.PubSub,
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  updatePlayerName: Repository.UpdatePlayerName,
  input: Graphql.RequireFields<
    Graphql.MutationUpdateGamePlayerNameArgs,
    "name" | "playerToken"
  >
): Promise<boolean> {
  const { playerId, gameId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );

  updatePlayerName(playerId, gameId, input.name);

  PubSub.gameConfigurationChanged(pubSub);
  return true;
}
