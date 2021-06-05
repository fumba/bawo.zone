import BawoCircularDoublyLinkedList from "../../src/js/core/BawoCircularDoublyLinkedList";
import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";

describe("BawoCircularDoublyLinkedList", () => {
  let topPlayerRows: BawoCircularDoublyLinkedList;
  let topPlayer: Player;

  beforeEach(() => {
    topPlayerRows = new BawoCircularDoublyLinkedList();
    topPlayer = new Player(PlayerSide.Top);
  });
  describe("#getHoleWithId", () => {
    test("should not allow player access if all the holes are not initialised", () => {
      expect(() => topPlayerRows.getHoleWithID(0)).toThrow(
        "All 16 holes belonging to the player must be added to the board before accessing them."
      );
    });
  });
});
