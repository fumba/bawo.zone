import AppConstants from "../../src/js/core/AppConstants";
import Player from "../../src/js/core/Player";
import PlayerBoardHoles from "../../src/js/core/PlayerBoardHoles";
import PlayerSide from "../../src/js/core/PlayerSide";

describe("PlayerBoardHoles", () => {
  const player = new Player(PlayerSide.Top);
  const numSeeds = 2;

  describe("#getHoleWithId", () => {
    test("should not allow player access if all the holes are not initialised", () => {
      expect(() => new PlayerBoardHoles(player).getHoleWithID(0)).toThrow(
        "All 16 holes belonging to the player must be added to the board before accessing them."
      );
    });

    describe("initialise player holes", () => {
      let playerBoardHoles: PlayerBoardHoles;
      beforeEach(() => {
        playerBoardHoles = new PlayerBoardHoles(player);
        for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
          playerBoardHoles.insertAtEnd(numSeeds);
        }
      });

      test("should allow hole access (ids: 0-15)", () => {
        for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
          expect(playerBoardHoles.getHoleWithID(index).id).toBe(index);
        }
      });

      test("should not allow invalid hole ids", () => {
        const invalidIds: Array<number> = [-1, 16];
        for (const id of invalidIds) {
          expect(() => playerBoardHoles.getHoleWithID(id)).toThrow(
            `Hole ID should fall within range 0 - 15 | Requested :${id}`
          );
        }
      });
    });
  });

  describe("#insertAtEnd", () => {
    test("should not insert more than 16 holes on player side", () => {
      expect(() => {
        const playerBoardHoles = new PlayerBoardHoles(player);
        for (
          let index = 0;
          index < AppConstants.NUM_PLAYER_HOLES + 1; // attempt to add one extra hole
          index++
        ) {
          playerBoardHoles.insertAtEnd(numSeeds);
        }
      }).toThrow("Only 16 holes can be added to the board for one player.");
    });
  });
});
