import * as Repository from "../../Repository";
import * as Eventually from "../Eventually";
import * as Models from "../../Models";

export function tests(repository: Repository.Repository) {
  describe("GameConfigurationRepository.create", () => {
    it("creates a new game", async () => {
      const newConfiguration: Models.NewGameConfiguration = {
        mapId: Models.userMapId("1")
      };
      const configurationId = await repository.createGameConfiguration(
        newConfiguration
      );

      return Eventually.eventually(async () => {
        const savedConfiguration = await repository.findGameConfigurationById(
          configurationId
        );
        expect(savedConfiguration.mapId.value).toEqual("1");
      });
    });

    it("updates a map", async () => {
      const newConfiguration: Models.NewGameConfiguration = {
        mapId: Models.userMapId("1")
      };

      const configurationId = await repository.createGameConfiguration(
        newConfiguration
      );

      const gameConfiguration = await repository.findGameConfigurationById(
        configurationId
      );
      expect(gameConfiguration.mapId.value).toEqual("1");

      await repository.updateGameMap(
        configurationId,
        Models.mapId("222", "default")
      );

      return Eventually.eventually(async () => {
        const savedConfiguration = await repository.findGameConfigurationById(
          configurationId
        );
        expect(savedConfiguration.mapId.value).toEqual("222");
        expect(Models.mapIdTypeString(savedConfiguration.mapId)).toEqual(
          "default"
        );
      });
    });
  });
}
