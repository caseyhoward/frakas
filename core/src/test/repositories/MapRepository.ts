import * as Repository from "../../Repository";
import * as Eventually from "../Eventually";

export function tests(repository: Repository.Repository) {
  describe("MapRepository.create", () => {
    it("creates a map and finds by id", async () => {
      const map = await repository.createMap({
        name: "abc",
        countries: [],
        bodiesOfWater: [],
        dimensions: { width: 0, height: 0 }
      });
      return Eventually.eventually(async () => {
        const foundMap = await repository.findMapById(map.id);
        expect(foundMap.name).toEqual("abc");
      });
    });

    it("creates a map and finds all by id", async () => {
      const maps = await Promise.all([
        repository.createMap({
          name: "abc",
          countries: [],
          bodiesOfWater: [],
          dimensions: { width: 0, height: 0 }
        }),
        repository.createMap({
          name: "abc",
          countries: [],
          bodiesOfWater: [],
          dimensions: { width: 0, height: 0 }
        })
      ]);
      return Eventually.eventually(async () => {
        const foundMaps = await repository.findAllMaps();
        expect(foundMaps).toContainEqual(maps[0]);
        expect(foundMaps).toContainEqual(maps[1]);
      });
    });
  });
}
