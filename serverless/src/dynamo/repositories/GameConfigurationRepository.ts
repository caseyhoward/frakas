import * as Table from "../Table";
import * as Models from "fracas-core/src/Models";
import * as Uuid from "fracas-core/src/Uuid";

export async function create(
  table: Table.Table,
  newGame: Models.NewGameConfiguration
): Promise<string> {
  const gameId = Uuid.generate();
  Table.put(
    table,
    { prefix: Table.PartitionKeyPrefix.game, value: gameId },
    Table.valueSortKey(Table.SortKeyValue.map),
    {
      MapId: newGame.mapId.value,
      MapType: Models.mapIdTypeString(newGame.mapId)
    }
  );
  return gameId;
}

export async function updateMap(
  table: Table.Table,
  id: string,
  mapId: Models.MapId
): Promise<boolean> {
  Table.put(
    table,
    { prefix: Table.PartitionKeyPrefix.game, value: id },
    Table.valueSortKey(Table.SortKeyValue.map),
    {
      MapId: mapId.value,
      MapType: Models.mapIdTypeString(mapId)
    }
  );
  return true;
}

export async function findById(
  table: Table.Table,
  id: string
): Promise<Models.GameConfiguration> {
  const result = await Table.get(
    table,
    { prefix: Table.PartitionKeyPrefix.game, value: id },
    Table.valueSortKey(Table.SortKeyValue.map)
  );
  if (result) {
    if (result.MapId && result.MapType) {
      const mapId = Models.mapId(
        result.MapId,
        stringToMapIdType(result.MapType)
      );
      return {
        id: id,
        mapId: mapId
      };
    } else {
      throw `Invalid game configuration: ${JSON.stringify(result)}`;
    }
  } else {
    throw "No map found for game";
  }
}

function stringToMapIdType(str: string): "user" | "default" {
  switch (str) {
    case "user":
      return "user";
    case "default":
      return "default";
    default:
      throw "Invalid map id type";
  }
}
