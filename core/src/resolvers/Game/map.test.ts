import * as Sinon from "sinon";
import * as Models from "../../Models";
import * as Graphql from "../../api/graphql";
import * as Builders from "../../test/Builders";
import mapResolver from "./map";

describe("Game.map", () => {
  it("gets a map for a game", async () => {
    const mapId = Models.userMapId("123");
    const map: Models.Map = { ...Builders.map({}), id: mapId };
    const game: Graphql.Game = <any>{ map: { id: "123" } };
    const findMapById: sinon.SinonStub<
      [Models.UserMapId],
      Promise<Models.Map>
    > = Sinon.stub();
    findMapById.withArgs(Sinon.match(mapId)).returns(Promise.resolve(map));
    expect(mapResolver(findMapById, game)).resolves.toEqual(
      Models.mapToGraphql(map)
    );
  });
});
