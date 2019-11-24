import * as Database from "./Database";

export enum PartitionKeyPrefix {
  gameToken = "game_token",
  game = "game",
  map = "map",
  playerToken = "player_token"
}

export enum SortKeyPrefix {
  player = "player",
  map = "map"
}

export enum SortKeyValue {
  gameToken = "game_token",
  map = "map",
  game = "game"
}

export type Table = {
  database: Database.Database;
  tableName: string;
};

function parseAttributes(
  attributeMap: AWS.DynamoDB.DocumentClient.AttributeMap
): OutputAttributes {
  return {
    SortKey: parseSortKey(attributeMap.SortKey),
    GameId: attributeMap.GameId,
    GameToken: attributeMap.GameToken,
    Game: attributeMap.Game,
    MapId: attributeMap.MapId,
    MapType: attributeMap.MapType,
    Name: attributeMap.Name,
    Color: attributeMap.Color,
    Countries: attributeMap.Countries,
    Dimensions: attributeMap.Dimensions,
    BodiesOfWater: attributeMap.BodiesOfWater,
    PlayerId: attributeMap.PlayerId
  };
}

// Don't forget to update parseAttributes when updating this. TODO: Figure out how to enforce this.
export type OutputAttributes = {
  SortKey: SortKey;
  BodiesOfWater?: string;
  Color?: string;
  Countries?: string;
  Dimensions?: string;
  GameId?: string;
  GameToken?: string;
  MapId?: string;
  MapType?: string;
  Name?: string;
  Game?: string;
  PlayerId?: string;
};

export type InputAttributes = {
  BodiesOfWater?: string;
  Color?: string;
  Dimensions?: string;
  GameId?: string;
  GameToken?: string;
  MapId?: string;
  Countries?: string;
  MapType?: string;
  Game?: string;
  Name?: string;
  PlayerId?: string;
};

export function get(
  table: Table,
  paritionKey: PartitionKey,
  sortKey: SortKey
): Promise<OutputAttributes | null> {
  return Database.get(table.database, table.tableName, {
    PartitionKey: generatePartitionKey(paritionKey),
    SortKey: generateSortKey(sortKey)
  }).then(parseGetAttributes);
}

export function query(
  table: Table,
  paritionKey: PartitionKey,
  sortKeyPrefix: SortKeyPrefix
): Promise<OutputAttributes[]> {
  return Database.query(
    table.database,
    table.tableName,
    "PartitionKey = :partitionKey AND begins_with(SortKey, :sortKey)",
    {
      ":partitionKey": generatePartitionKey(paritionKey),
      ":sortKey": `${sortKeyPrefix}${delimiter}`
    }
  ).then(items => {
    if (items) {
      return items.map(parseAttributes);
    } else {
      throw "Items was null for query";
    }
  });
}

export function put(
  table: Table,
  paritionKey: PartitionKey,
  sortKey: SortKey,
  attributes: InputAttributes
): Promise<void> {
  return Database.put(table.database, table.tableName, {
    PartitionKey: generatePartitionKey(paritionKey),
    SortKey: generateSortKey(sortKey),
    ...attributes
  });
}

export function update(
  table: Table,
  paritionKey: PartitionKey,
  sortKey: SortKey,
  attributes: InputAttributes
): Promise<void> {
  const expressionParts: string[] = [];
  const values: { [name: string]: string } = {};
  const attributeNames: { [name: string]: string } = {};
  Object.keys(attributes).forEach(function(attributeName) {
    expressionParts.push(`#${attributeName} = :${attributeName}`);
    values[`:${attributeName}`] = (<any>attributes)[attributeName]; // TODO: Get rid of any
    attributeNames[`#${attributeName}`] = attributeName; // TODO: Get rid of any
  });
  const updateExpresssion = `set ${expressionParts.join(", ")}`;
  return Database.update(
    table.database,
    table.tableName,
    {
      PartitionKey: generatePartitionKey(paritionKey),
      SortKey: generateSortKey(sortKey)
    },
    updateExpresssion,
    values,
    attributeNames
  );
}

export function partitionKey(
  prefix: PartitionKeyPrefix,
  value: string
): PartitionKey {
  return {
    prefix,
    value
  };
}

export function noSortKey(): NoSortKey {
  return { type: "NoSortKey" };
}

export function valueSortKey(value: SortKeyValue): ValueSortKey {
  return { type: "ValueSortKey", value };
}

export function prefixAndValueSortKey(
  prefix: SortKeyPrefix,
  value: string
): PrefixAndValueSortKey {
  return { type: "PrefixAndValueSortKey", prefix, value };
}

type PartitionKey = {
  prefix: PartitionKeyPrefix;
  value: string;
};

type SortKey = NoSortKey | PrefixAndValueSortKey | ValueSortKey;

type NoSortKey = { type: "NoSortKey" };

type PrefixAndValueSortKey = {
  type: "PrefixAndValueSortKey";
  prefix: SortKeyPrefix;
  value: string;
};

type ValueSortKey = {
  type: "ValueSortKey";
  value: SortKeyValue;
};

const delimiter = ":";

function generatePartitionKey(partitionKey: PartitionKey): string {
  return [partitionKey.prefix, partitionKey.value].join(delimiter);
}

function generateSortKey(sortKey: SortKey): string {
  switch (sortKey.type) {
    case "NoSortKey":
      return "_";
    case "ValueSortKey":
      return sortKey.value;
    case "PrefixAndValueSortKey":
      return [sortKey.prefix, sortKey.value].join(delimiter);
  }
}

function parseGetAttributes(
  attributeMap: AWS.DynamoDB.DocumentClient.AttributeMap | null
): OutputAttributes | null {
  if (attributeMap) {
    return parseAttributes(attributeMap);
  } else {
    return null;
  }
}

function parseSortKey(sortKey: string): SortKey {
  const [value1, value2] = sortKey.split(delimiter);
  if (value2) {
    if (value1) {
      return prefixAndValueSortKey(parseSortKeyPrefix(value1), value2);
    } else {
      throw `Sort key value present without prefix: ${sortKey}`;
    }
  } else {
    if (value1 == noSortKeyValue) {
      return noSortKey();
    } else {
      return valueSortKey(parseSortKeyValue(value1));
    }
  }
}

function parseSortKeyPrefix(sortKeyPrefix: string): SortKeyPrefix {
  switch (sortKeyPrefix) {
    case "player":
      return SortKeyPrefix.player;
    case "map":
      return SortKeyPrefix.map;
    default:
      throw `Unknown sort key prefix: ${sortKeyPrefix}`;
  }
}

function parseSortKeyValue(sortKeyValue: string): SortKeyValue {
  switch (sortKeyValue) {
    case "game_token":
      return SortKeyValue.gameToken;
    case "map":
      return SortKeyValue.map;
    case "game":
      return SortKeyValue.game;
    default:
      throw `Unknown sort key value: ${sortKeyValue}`;
  }
}

const noSortKeyValue = "_";
