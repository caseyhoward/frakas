import * as Player from "./Player";
import * as Color from "./Color";
import * as Builders from "../test/Builders";

describe("Player.getNextAvailablePlayerColor", () => {
  it("gets the next color that a player isn't already using", async () => {
    const playerConfigurations: Player.PlayerConfiguration[] = [
      {
        ...Builders.playerConfiguration(),
        color: Color.darkGreen
      },
      {
        ...Builders.playerConfiguration(),
        color: Color.lightYellow
      },
      { ...Builders.playerConfiguration(), color: Color.orange }
    ];
    const color = await Player.getNextAvailablePlayerColor(
      playerConfigurations
    );
    expect(color).toEqual(Color.lightGreen);
  });
});

describe("Player.buildHost", () => {
  it("gets the next color that a player isn't already using", async () => {
    const gameId: string = Builders.uniqueId();
    const host: Player.NewPlayerConfiguration = await {
      ...Player.buildHost(gameId)
    };
    const expectedHost: Player.NewPlayerConfiguration = {
      name: "Host",
      gameId,
      color: Color.lightGreen
    };
    expect(host).toEqual(expectedHost);
  });
});
