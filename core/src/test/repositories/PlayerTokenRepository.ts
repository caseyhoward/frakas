import * as Builders from "../Builders";
import * as Repository from "../../Repository";

export function tests(repository: Repository.Repository) {
  describe("PlayerTokenRepository.create and .findByToken", () => {
    it("creates a new player token", async () => {
      const newPlayerToken = Builders.playerToken();
      await repository.createPlayerToken(
        newPlayerToken.playerToken,
        newPlayerToken.playerId,
        newPlayerToken.gameId
      );
      const savedPlayerToken = await repository.findGameIdAndPlayerIdByToken(
        newPlayerToken.playerToken
      );
      expect(savedPlayerToken).toEqual(newPlayerToken);
    });
  });
}
