import * as Table from "../Table";

export async function create(
  table: Table.Table,
  gameToken: string,
  gameId: string
): Promise<void> {
  return await Promise.all([
    Table.put(
      table,
      { prefix: Table.PartitionKeyPrefix.gameToken, value: gameToken },
      Table.noSortKey(),
      { GameId: gameId }
    ),
    Table.put(
      table,
      { prefix: Table.PartitionKeyPrefix.game, value: gameId },
      Table.valueSortKey(Table.SortKeyValue.gameToken),
      { GameToken: gameToken }
    )
  ]).then(_ => undefined);
}

export async function findGameIdByToken(
  table: Table.Table,
  gameToken: string
): Promise<string> {
  return Table.get(
    table,
    {
      prefix: Table.PartitionKeyPrefix.gameToken,
      value: gameToken
    },
    Table.noSortKey()
  ).then(result => {
    if (result && result.GameId) {
      return result.GameId;
    } else {
      throw "Game token not found";
    }
  });
}

export async function findGameTokenByGameId(
  table: Table.Table,
  gameId: string
): Promise<string> {
  return Table.get(
    table,
    {
      prefix: Table.PartitionKeyPrefix.game,
      value: gameId
    },
    Table.valueSortKey(Table.SortKeyValue.gameToken)
  ).then(result => {
    if (result && result.GameToken) {
      return result.GameToken;
    } else {
      throw "Game token not found";
    }
  });
}
