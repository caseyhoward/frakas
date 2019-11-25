import * as PubSub from "../../PubSub";
import * as Uuid from "../../Uuid";
import * as Repository from "../../Repository";
import * as graphql from "../../api/graphql";
import * as Player from "../../models/Player";

export default async function joinGame(
  createPlayerConfiguration: Repository.CreatePlayerConfiguration,
  createPlayerToken: Repository.CreatePlayerToken,
  findAllPlayersGameId: Repository.FindAllPlayersForGame,
  findGameIdByToken: Repository.FindGameIdByToken,
  pubSub: PubSub.PubSub,
  input: graphql.RequireFields<graphql.MutationJoinGameArgs, "joinGameToken">
): Promise<string> {
  const playerToken = Uuid.generate();

  // const gameId = await findGameIdByToken(input.joinGameToken);

  // const allExistingPlayers = await findAllPlayersGameId(gameId);

  // const playerConfiguration = await createPlayerConfiguration({
  //   name: "",
  //   gameId: gameId,
  //   color: Player.getNextAvailablePlayerColor(allExistingPlayers) // Potential race here. Two players can receive same color.
  // });

  // await createPlayerToken(playerToken, playerConfiguration.id, gameId);

  PubSub.gameConfigurationChanged(pubSub);
  return playerToken;
}
