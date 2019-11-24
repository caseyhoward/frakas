import * as Table from "../Table";
import * as Color from "fracas-core/src/models/Color";
import * as Player from "fracas-core/src/models/Player";
import * as Uuid from "fracas-core/src/Uuid";

export async function create(
  table: Table.Table,
  newPlayer: Player.NewPlayerConfiguration
): Promise<Player.PlayerConfiguration> {
  const playerId = Uuid.generate();
  await Table.put(
    table,
    {
      prefix: Table.PartitionKeyPrefix.game,
      value: newPlayer.gameId
    },
    Table.prefixAndValueSortKey(Table.SortKeyPrefix.player, playerId),
    {
      Color: Color.toJson(newPlayer.color)
    }
  );
  return { id: playerId, ...newPlayer };
}

export async function findAllByGameId(
  table: Table.Table,
  gameId: string
): Promise<Player.PlayerConfiguration[]> {
  return await Table.query(
    table,
    { prefix: Table.PartitionKeyPrefix.game, value: gameId },
    Table.SortKeyPrefix.player
  ).then(items => {
    if (items) {
      return items.map(item => {
        if (item.SortKey.type === "PrefixAndValueSortKey" && item.Color) {
          return {
            id: item.SortKey.value,
            gameId: gameId,
            name: item.Name || "",
            color: Color.fromJson(item.Color)
          };
        } else {
          throw `Invalid player configuration: ${JSON.stringify(item)}`;
        }
      });
    } else {
      throw `No players found for game: ${gameId}`;
    }
  });
}

export async function updateColor(
  table: Table.Table,
  playerId: string,
  gameId: string,
  color: Color.Color
): Promise<void> {
  await Table.update(
    table,
    {
      prefix: Table.PartitionKeyPrefix.game,
      value: gameId
    },
    Table.prefixAndValueSortKey(Table.SortKeyPrefix.player, playerId),
    {
      Color: Color.toJson(color)
    }
  );
}

export async function updateName(
  table: Table.Table,
  playerId: string,
  gameId: string,
  name: string
): Promise<void> {
  await Table.update(
    table,
    {
      prefix: Table.PartitionKeyPrefix.game,
      value: gameId
    },
    Table.prefixAndValueSortKey(Table.SortKeyPrefix.player, playerId),
    {
      Name: name
    }
  );
}

export async function update(
  table: Table.Table,
  player: Player.PlayerConfiguration
): Promise<void> {
  await Table.update(
    table,
    {
      prefix: Table.PartitionKeyPrefix.game,
      value: player.gameId
    },
    Table.prefixAndValueSortKey(Table.SortKeyPrefix.player, player.id),
    {
      Name: player.name,
      Color: Color.toJson(player.color)
    }
  );
}
