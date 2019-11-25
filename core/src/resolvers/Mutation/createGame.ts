import * as Uuid from "../../Uuid";
import * as Repository from "../../Repository";
import * as Player from "../../models/Player";
import * as Models from "../../Models";

export default async function createGame(
  createGameToken: Repository.CreateGameToken,
  createGameConfiguration: Repository.CreateGameConfiguration,
  createPlayerToken: Repository.CreatePlayerToken,
  createPlayerConfiguration: Repository.CreatePlayerConfiguration
): Promise<string> {
  const hostToken = Uuid.generate();
  const gameToken = Uuid.generate();

  const gameId = await createGameConfiguration({
    mapId: Models.mapId("1", "default")
  });

  const host = await createPlayerConfiguration(Player.buildHost(gameId));

  await createGameToken(gameToken, gameId);

  await createPlayerToken(hostToken, host.id, gameId);

  return hostToken;
}
