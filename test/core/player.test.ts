import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";

test("should assign player on top", () => {
  expect(new Player(PlayerSide.Top).side).toBe(PlayerSide.Top);
});

test("should assign player on bottom", () => {
  expect(new Player(PlayerSide.Bottom).side).toBe(PlayerSide.Bottom);
});

test("player should initially have no seeds in hand", () => {
  expect(new Player(PlayerSide.Bottom).numSeedsInHand).toBe(0);
});

test("player should initially not have any previously tracked capture moves", () => {
  expect(new Player(PlayerSide.Bottom).capturedOnPrevMove).toBe(false);
});

describe("add seeds to hand", () => {
  let player: Player;
  beforeEach(() => {
    player = new Player(PlayerSide.Top);
  });
  test("should add correct number of seeds", () => {
    player.addSeeds(1);
    expect(player.numSeedsInHand).toBe(1);
    player.addSeeds(10);
    expect(player.numSeedsInHand).toBe(11);
  });

  test("should not allow more than 64 seeds to be added", () => {
    expect(() => player.addSeeds(65)).toThrow(
      "Total number of seeds after operation is greater than 64 | input: 65"
    );
  });

  test("should not allow player to add zero seeds", () => {
    expect(() => player.addSeeds(0)).toThrow(
      "Attempted to add or remove no seeds"
    );
  });

  test("should not allow player to add negative number of seeds", () => {
    expect(() => player.addSeeds(-1)).toThrow(
      "Attempted to add or remove negative number seeds | input : -1"
    );
  });
});

describe("remove seeds from hand", () => {
  let player: Player;
  beforeEach(() => {
    player = new Player(PlayerSide.Top);
  });
  test("should remove correct number of seeds", () => {
    player.addSeeds(10);
    player.removeSeeds(2);
    expect(player.numSeedsInHand).toBe(8);
    player.removeSeeds(1);
    expect(player.numSeedsInHand).toBe(7);
  });

  test("should not allow seeds to be removed from an empty hand", () => {
    expect(() => player.removeSeeds(1)).toThrow(
      "Total number of seeds after operation is negative | input: -1"
    );
  });

  test("should not allow zero seeds to be removed", () => {
    expect(() => player.removeSeeds(0)).toThrow(
      "Attempted to add or remove no seeds"
    );
  });

  test("should not allow player to remove negative number of seeds", () => {
    expect(() => player.addSeeds(-1)).toThrow(
      "Attempted to add or remove negative number seeds | input : -1"
    );
  });
});

describe("#isOnTopSide", () => {
  test("should return true if player is on the top side of the board", () => {
    expect(new Player(PlayerSide.Top).isOnTopSide()).toBe(true);
  });

  test("should return false if player is on the bottom side of the board", () => {
    expect(new Player(PlayerSide.Bottom).isOnTopSide()).toBe(false);
  });
});
