import * as Player from "../../models/Player";
import * as Color from "../../models/Color";
// import * as Eventually from "../Eventually";
import * as Builders from "../Builders";
import * as Repository from "../../Repository";

export function tests(repository: Repository.Repository) {
  describe("PlayerConfigurationRepository.create", () => {
    it("creates a new player", async () => {
      const newPlayer = { ...Builders.newPlayerConfiguration(), name: "" };
      const createdPlayer = await repository.createPlayerConfiguration(
        newPlayer
      );
      expect(createdPlayer).toMatchObject<Player.NewPlayerConfiguration>(
        newPlayer
      );
      // return Eventually.eventually(async () => {
      const players = await repository.findAllPlayersForGame(newPlayer.gameId);
      expect(players).toEqual([createdPlayer]);
      // });
    });
  });

  describe("PlayerConfigurationRepository.findAllByGameId", () => {
    it("returns all player configurations by game id", async () => {
      const newPlayer1 = { ...Builders.newPlayerConfiguration(), name: "" };
      const newPlayer2 = { ...newPlayer1 };
      const createdPlayer1 = await repository.createPlayerConfiguration(
        newPlayer1
      );
      const createdPlayer2 = await repository.createPlayerConfiguration(
        newPlayer2
      );
      // return Eventually.eventually(async () => {
      const players = await repository.findAllPlayersForGame(newPlayer1.gameId);
      expect(new Set(players)).toEqual(
        new Set([createdPlayer1, createdPlayer2])
      );
      // });
    });
  });

  describe("PlayerConfigurationRepository.updatePlayerColor", () => {
    it("updates player color", async () => {
      const newPlayer = {
        ...Builders.newPlayerConfiguration(),
        color: Color.black
      };
      const createdPlayer = await repository.createPlayerConfiguration(
        newPlayer
      );
      const newColor = Color.blue;
      await repository.updatePlayerColor(
        createdPlayer.id,
        createdPlayer.gameId,
        newColor
      );
      const players = await repository.findAllPlayersForGame(newPlayer.gameId);
      expect(players).toEqual([{ ...createdPlayer, color: newColor }]);
    });
  });

  describe("PlayerConfigurationRepository.updateName", () => {
    it("updates player color", async () => {
      const newPlayer = {
        ...Builders.newPlayerConfiguration()
      };
      const createdPlayer = await repository.createPlayerConfiguration(
        newPlayer
      );
      const newName = "new name";
      await repository.updatePlayerName(
        createdPlayer.id,
        createdPlayer.gameId,
        newName
      );
      const players = await repository.findAllPlayersForGame(newPlayer.gameId);
      expect(players).toEqual([{ ...createdPlayer, name: newName }]);
    });
  });
}
