import * as TestDatabase from "../../test/Database";
import * as Eventually from "fracas-shared/src/test/Eventually";
import * as Builders from "fracas-shared/src/test/Builders";
import * as Database from "./Database";

describe("Database", () => {
  it("puts and gets items", async () => {
    const id = Builders.uniqueId();
    const partitionKey = `some-id-${id}`;

    await Database.put(TestDatabase.database, "fracas-dev", {
      PartitionKey: partitionKey,
      SortKey: "some-sort",
      Blah: "abc"
    });

    const result = await Database.get(TestDatabase.database, "fracas-dev", {
      PartitionKey: partitionKey,
      SortKey: "some-sort"
    });

    expect(result).toEqual({
      PartitionKey: partitionKey,
      SortKey: "some-sort",
      Blah: "abc"
    });
  });

  it("puts and queries items", async () => {
    const id = Builders.uniqueId();
    const partitionKey = `some-id-${id}`;

    [1, 2, 3, 4].forEach(
      async number =>
        await Database.put(TestDatabase.database, "fracas-dev", {
          PartitionKey: partitionKey,
          SortKey: `some-sort-${number}`,
          Blah: "abc"
        })
    );

    await Eventually.eventually(async () => {
      const result = await Database.query(
        TestDatabase.database,
        "fracas-dev",
        "PartitionKey = :partitionKey AND SortKey BETWEEN :sortKey1 AND :sortKey2",
        {
          ":partitionKey": partitionKey,
          ":sortKey1": "some-sort-2",
          ":sortKey2": "some-sort-3"
        }
      );

      expect(result).toEqual([
        {
          PartitionKey: partitionKey,
          SortKey: "some-sort-2",
          Blah: "abc"
        },
        {
          PartitionKey: partitionKey,
          SortKey: "some-sort-3",
          Blah: "abc"
        }
      ]);
    });
  });

  it("puts, updates, and queries items", async () => {
    const id = Builders.uniqueId();
    const partitionKey = `some-id-${id}`;

    await Database.put(TestDatabase.database, "fracas-dev", {
      PartitionKey: partitionKey,
      SortKey: "some-sort",
      Test: "abc",
      Something: "123"
    });

    const result = await Database.get(TestDatabase.database, "fracas-dev", {
      PartitionKey: partitionKey,
      SortKey: "some-sort"
    });

    expect(result).toEqual({
      PartitionKey: partitionKey,
      SortKey: "some-sort",
      Test: "abc",
      Something: "123"
    });

    await Database.update(
      TestDatabase.database,
      "fracas-dev",
      {
        PartitionKey: partitionKey,
        SortKey: "some-sort"
      },
      "set #abc = :something",
      { ":something": "456" },
      { "#abc": "Something" }
    );

    const afterUpdateResult = await Database.get(
      TestDatabase.database,
      "fracas-dev",
      {
        PartitionKey: partitionKey,
        SortKey: "some-sort"
      }
    );

    expect(afterUpdateResult).toEqual({
      PartitionKey: partitionKey,
      SortKey: "some-sort",
      Test: "abc",
      Something: "456"
    });
  });
});
