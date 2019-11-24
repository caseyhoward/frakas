import * as Table from "../Table";
import * as Models from "fracas-shared/src/Models";

export async function create(
  table: Table.Table,
  playerToken: string,
  playerId: string,
  gameId: string
): Promise<Models.PlayerToken> {
  await Table.put(
    table,
    {
      prefix: Table.PartitionKeyPrefix.playerToken,
      value: playerToken
    },
    Table.noSortKey(),
    { GameId: gameId, PlayerId: playerId }
  );
  return { __typename: "PlayerToken", gameId, playerId, playerToken };
}

export function findByToken(
  table: Table.Table,
  playerToken: string
): Promise<Models.PlayerToken> {
  return Table.get(
    table,
    {
      prefix: Table.PartitionKeyPrefix.playerToken,
      value: playerToken
    },
    Table.noSortKey()
  ).then(item => {
    if (item) {
      if (item.GameId && item.PlayerId) {
        return {
          __typename: "PlayerToken",
          playerToken,
          gameId: item.GameId,
          playerId: item.PlayerId
        };
      } else {
        throw `Invalid player token: ${JSON.stringify(item)}`;
      }
    } else {
      throw `Player token not found: ${playerToken}`;
    }
  });
}
