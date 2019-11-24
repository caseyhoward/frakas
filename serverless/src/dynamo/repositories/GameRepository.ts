import * as Table from "../Table";
import * as Models from "fracas-shared/src/Models";

export function save(table: Table.Table, game: Models.Game): Promise<void> {
  return Promise.all([
    Table.put(
      table,
      {
        prefix: Table.PartitionKeyPrefix.game,
        value: game.id
      },
      Table.valueSortKey(Table.SortKeyValue.game),
      {
        Game: JSON.stringify({
          neutralCountryTroops: game.neutralCountryTroops,
          playerTurn: game.playerTurn,
          players: game.players
        })
      }
    ),
    Table.put(
      table,
      {
        prefix: Table.PartitionKeyPrefix.game,
        value: game.id
      },
      Table.valueSortKey(Table.SortKeyValue.map),
      {
        MapId: game.mapId.value,
        MapType: game.mapId.__typename
      }
    )
  ]).then(_ => undefined);
}

export async function saveWithoutMap(
  table: Table.Table,
  game: Models.GameWithoutMap
): Promise<void> {
  return Table.put(
    table,
    {
      prefix: Table.PartitionKeyPrefix.game,
      value: game.id
    },
    Table.valueSortKey(Table.SortKeyValue.game),
    {
      Game: JSON.stringify(game)
    }
  );
}

export async function findById(
  table: Table.Table,
  id: string
): Promise<Models.Game> {
  return Promise.all([
    Table.get(
      table,
      {
        prefix: Table.PartitionKeyPrefix.game,
        value: id
      },
      Table.valueSortKey(Table.SortKeyValue.game)
    ).then(item => {
      if (item && item.Game) {
        return JSON.parse(item.Game);
      } else {
        throw "Invalid game";
      }
    }),
    Table.get(
      table,
      {
        prefix: Table.PartitionKeyPrefix.game,
        value: id
      },
      Table.valueSortKey(Table.SortKeyValue.map)
    ).then(item => {
      if (item && item.MapId && item.MapType) {
        return { mapId: item.MapId, mapType: item.MapType };
      } else {
        throw "Invalid game";
      }
    })
  ]).then(([game, map]) => {
    const mapType: "user" | "default" =
      map.mapType === "UserMapId" ? "user" : "default";
    return {
      __typename: "Game",
      id: id,
      mapId: Models.mapId(map.mapId, mapType),
      players: game.players,
      playerTurn: game.playerTurn,
      neutralCountryTroops: game.neutralCountryTroops
    };
  });
}
