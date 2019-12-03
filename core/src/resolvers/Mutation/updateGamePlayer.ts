import * as Graphql from "../../api/graphql";
import * as PubSub from "../../PubSub";
import * as Repository from "../../Repository";
import * as Color from "../../models/Color";

export default async function updateGamePlayer(
  pubSub: PubSub.PubSub,
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  updateGamePlayer: Repository.UpdateGamePlayer,
  input: Graphql.RequireFields<
    Graphql.MutationUpdateGamePlayerArgs,
    "color" | "name" | "playerToken"
  >
): Promise<boolean> {
  const { playerId, gameId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );

  const updatedPlayer = {
    id: playerId,
    gameId,
    color: Color.fromColorInput(input.color),
    name: input.name
  };

  updateGamePlayer(updatedPlayer);

  PubSub.gamePlayerUpdated(pubSub, updatedPlayer);
  return true;
}
