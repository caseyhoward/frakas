import * as TestRepository from "../../../test/Repository";
import * as Uuid from "fracas-shared/src/Uuid";

describe("GameTokenRepository.create", () => {
  it("creates a new game token and finds token by id", async () => {
    const gameToken = "some-token";
    const gameId = Uuid.generate();
    await TestRepository.repository.createGameToken(gameToken, gameId);
    const foundGameId = await TestRepository.repository.findGameIdByToken(
      gameToken
    );
    expect(foundGameId).toEqual(gameId);
  });

  it("creates a new game token and finds id by token", async () => {
    const gameToken = "some-token";
    const gameId = Uuid.generate();
    await TestRepository.repository.createGameToken(gameToken, gameId);
    const foundGameToken = await TestRepository.repository.findGameTokenByGameId(
      gameId
    );
    expect(foundGameToken).toEqual(gameToken);
  });
});
