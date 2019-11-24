import * as Graphql from "../../api/graphql";
import * as PubSub from "../../PubSub";
import * as Models from "../../Models";
import * as Repository from "../../Repository";

export async function updateMapForGame(
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  updateMapForGame: Repository.UpdateGameMap,
  pubSub: PubSub.PubSub,
  input: Graphql.RequireFields<
    Graphql.MutationUpdateGameMapArgs,
    "mapId" | "mapIdType" | "playerToken"
  >
): Promise<boolean> {
  let mapIdType: "user" | "default";

  if (input.mapIdType === "user") {
    mapIdType = "user";
  } else if (input.mapIdType === "default") {
    mapIdType = "default";
  } else {
    throw "Unknown map id type";
  }
  const mapId: Models.MapId = Models.mapId(input.mapId, mapIdType);
  const { gameId, playerId } = await findGameIdAndPlayerIdByToken(
    input.playerToken
  );
  console.log("TODO: verify player is host", playerId);
  await updateMapForGame(gameId.toString(), mapId);
  PubSub.gameConfigurationChanged(pubSub);
  return true;
}
