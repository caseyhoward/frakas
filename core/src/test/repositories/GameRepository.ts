import * as Repository from "../../Repository";
import * as Builders from "../../test/Builders";
import * as Models from "../../Models";
import * as Eventually from "../../test/Eventually";

export function tests(repository: Repository.Repository) {
  describe("GameRepository.save", () => {
    it("saves a game and finds by id", async () => {
      const newGameConfiguration = await Builders.newGameConfiguration();
      const gameConfigurationId = await repository.createGameConfiguration(
        newGameConfiguration
      );
      const game: Models.Game = {
        ...Builders.game(gameConfigurationId)
      };
      await repository.updateGame(game);
      return Eventually.eventually(async () => {
        const savedGame = await repository.findGameById(gameConfigurationId);
        expect(savedGame).toEqual(game);
      });
    });
  });

  describe("GameRepository.saveWithoutMap", () => {
    it("saves a game without map and finds by id", async () => {
      const newGameConfiguration = await Builders.newGameConfiguration();
      const gameConfigurationId = await repository.createGameConfiguration(
        newGameConfiguration
      );
      const gameWithoutMap = Builders.gameWithoutMap(gameConfigurationId);
      await repository.updateGameWithoutMap(gameWithoutMap);
      return Eventually.eventually(async () => {
        const savedGame = await repository.findGameById(gameConfigurationId);
        expect(savedGame).toEqual({
          ...gameWithoutMap,
          __typename: "Game",
          mapId: Models.mapId("123", "default")
        });
      });
    });
  });
}
