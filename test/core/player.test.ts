import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";

test("should assign player on top", () => {
  expect(new Player(PlayerSide.Top).side).toBe(PlayerSide.Top);
});

test("should assign player on bottom", () => {
  expect(new Player(PlayerSide.Bottom).side).toBe(PlayerSide.Bottom);
});
