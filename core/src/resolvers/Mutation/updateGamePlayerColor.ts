import * as Graphql from "../../api/graphql";
import * as PubSub from "../../PubSub";
import * as Repository from "../../Repository";
import * as Color from "../../models/Color";

export default async function updatePlayerColor(
  pubSub: PubSub.PubSub,
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  updatePlayerColor: Repository.UpdatePlayerColor,
  input: Graphql.RequireFields<
    Graphql.MutationUpdateGamePlayerColorArgs,
    "color" | "playerToken"
  >
): Promise<boolean> {
  const { playerId, gameId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );

  updatePlayerColor(playerId, gameId, Color.fromColorInput(input.color));

  PubSub.gameConfigurationChanged(pubSub);
  return true;
}
