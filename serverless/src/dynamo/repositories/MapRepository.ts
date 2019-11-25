import * as Table from "../Table";
import * as Models from "fracas-core/src/Models";
import * as Uuid from "fracas-core/src/Uuid";

export async function create(
  table: Table.Table,
  newMap: Models.NewMap
): Promise<Models.Map> {
  const mapId = Uuid.generate();
  Table.put(
    table,
    { prefix: Table.PartitionKeyPrefix.map, value: "todo-get-rid-of-me" },
    Table.prefixAndValueSortKey(Table.SortKeyPrefix.map, mapId),
    {
      Name: newMap.name,
      Countries: JSON.stringify(newMap.countries),
      BodiesOfWater: JSON.stringify(newMap.bodiesOfWater),
      Dimensions: JSON.stringify(newMap.dimensions)
    }
  );
  return { ...newMap, id: Models.userMapId(mapId) };
}

export async function findById(
  table: Table.Table,
  id: Models.UserMapId
): Promise<Models.Map> {
  return Table.get(
    table,
    { prefix: Table.PartitionKeyPrefix.map, value: "todo-get-rid-of-me" },
    Table.prefixAndValueSortKey(Table.SortKeyPrefix.map, id.value)
  ).then(item => {
    if (item) {
      return itemToMap(item);
    } else {
      throw ";";
    }
  });
}

export async function findAll(table: Table.Table): Promise<Models.Map[]> {
  return Table.query(
    table,
    {
      prefix: Table.PartitionKeyPrefix.map,
      value: "todo-get-rid-of-me"
    },
    Table.SortKeyPrefix.map
  ).then(items => items.map(itemToMap));
}

function itemToMap(item: Table.OutputAttributes): Models.Map {
  if (
    item &&
    item.Name &&
    item.Countries &&
    item.BodiesOfWater &&
    item.Dimensions &&
    item.SortKey.type === "PrefixAndValueSortKey"
  ) {
    return {
      id: Models.userMapId(item.SortKey.value),
      name: item.Name,
      countries: JSON.parse(item.Countries),
      bodiesOfWater: JSON.parse(item.BodiesOfWater),
      dimensions: JSON.parse(item.Dimensions)
    };
  } else {
    throw `Invalid map: ${JSON.stringify(item)}`;
  }
}
