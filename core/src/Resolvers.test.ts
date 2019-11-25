import { create } from "./Resolvers";

describe("resolvers", () => {
  it("doesn't blow up", () => {
    expect(create).toBeDefined();
  });
});
