import * as Repository from "../../Repository";
import * as Models from "../../Models";
import * as Color from "../../models/Color";
import * as Graphql from "../../api/graphql";
import * as PubSub from "../../PubSub";

export default async function saveGame(
  findGameIdAndPlayerIdByToken: Repository.FindGameIdAndPlayerIdByToken,
  updateGameWithoutMap: Repository.UpdateGameWithoutMap,
  pubSub: PubSub.PubSub,
  input: Graphql.RequireFields<
    Graphql.MutationSaveGameArgs,
    "playerToken" | "game"
  >
): Promise<boolean> {
  const { playerId } = await findGameIdAndPlayerIdByToken(input.playerToken);

  const playerTurn: Models.PlayerTurn = {
    ...input.game.playerTurn,
    __typename: "PlayerTurn",
    fromCountryId: input.game.playerTurn.fromCountryId || undefined,
    troopCount: input.game.playerTurn.troopCount || undefined
  };

  const game: Models.GameWithoutMap = {
    ...input.game,
    id: input.game.id,
    playerTurn: playerTurn,
    neutralCountryTroops: input.game.neutralCountryTroops.map(
      neutralCountryTroops => {
        return { ...neutralCountryTroops, __typename: "CountryTroopCounts" };
      }
    ),
    players: input.game.players.map(player => {
      return {
        __typename: "GamePlayer",
        ...player,
        id: player.id,
        color: Color.fromColorInput(player.color),
        countryTroopCounts: player.countryTroopCounts.map(
          countryTroopCounts => {
            return { ...countryTroopCounts, __typename: "CountryTroopCounts" };
          }
        ),
        capitol: player.capitol || undefined
      };
    })
  };

  await updateGameWithoutMap(game);

  PubSub.gameChanged(pubSub, game, playerId);

  return true;
}
