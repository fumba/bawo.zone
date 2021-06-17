/*
 * bawo.zone - <a href="https://bawo.zone">https://bawo.zone</a>
 * <a href="https://github.com/fumba/bawo.zone">https://github.com/fumba/bawo.zone</a>
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Board from "../../src/js/core/Board";
import Hole from "../../src/js/core/Hole";
import Move from "../../src/js/core/Move";
import MoveDirection from "../../src/js/core/MoveDirection";
import PlayerBoardHoles from "../../src/js/core/PlayerBoardHoles";

describe("Move", () => {
  const board: Board = new Board();
  const topPlayerHoles: PlayerBoardHoles = board.topPlayer.boardHoles;
  const btmPlayerHoles: PlayerBoardHoles = board.bottomPlayer.boardHoles;
  const hole: Hole = topPlayerHoles.getHoleWithID(1);
  const direction: MoveDirection = MoveDirection.Clockwise;
  test("should initialise values correctly", () => {
    const move: Move = new Move(hole, direction);
    expect(move.prevContinuedMovesCount).toBe(0);
    expect(move.hole).toBe(hole);
    expect(move.direction).toBe(direction);
  });

  describe("#isContinuing", () => {
    const move: Move = new Move(hole, direction);
    test("should correctly identify moves that are not continuing", () => {
      expect(move.isContinuing()).toBe(false);
    });

    test("should correctly identify moves that are continuing", () => {
      move.prevContinuedMovesCount = 1;
      expect(move.isContinuing()).toBe(true);
    });
  });

  describe("#sowsSeedInFrontHole", () => {
    describe("when top player is sowing seeds", () => {
      /*
       *    TOP PLAYER siitting position (facing down)
       *    00	01	02	03	04	05	06	07
       *    15	14	13	12	11	10	09	08
       *
       *    00	01	02	03	04	05	06	07
       *    15	14	13	12	11	10	09	08
       *    BOTTOM PLAYER sitting position (facing up)
       * */
      describe("direction- clockwise", () => {
        const direction = MoveDirection.Clockwise;

        test("should return correct value for multi-step moves that start from the back", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(6),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for one-step moves that start from the back.", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(7),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for non-qualifying moves that start from the back", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(0),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for non-qualifying moves that start from the front", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(5),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for qualifying moves that start from the front", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(11),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });
      });

      describe("direction- anticlockwise", () => {
        const direction = MoveDirection.AntiClockwise;

        /*
         *    TOP PLAYER sitting position (facing down)
         *    00	01	02	03	04	05	06	07
         *    15	14	13	12	11	10	09	08
         *
         *    00	01	02	03	04	05	06	07
         *    15	14	13	12	11	10	09	08
         *    BOTTOM PLAYER sitting position (facing up)
         * */
        test("should return correct value for multi-step moves that start from the back", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(1),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for one-step moves that start from the back.", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(0),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for non-qualifying moves that start from the back", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(7),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for non-qualifying moves that start from the front", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(8),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for qualifying moves that start from the front", () => {
          const move: Move = new Move(
            topPlayerHoles.getHoleWithID(11),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });
      });
    });

    describe("when bottom player is sowing seeds", () => {
      /*
       *    TOP PLAYER siitting position (facing down)
       *    00	01	02	03	04	05	06	07
       *    15	14	13	12	11	10	09	08
       *
       *    00	01	02	03	04	05	06	07
       *    15	14	13	12	11	10	09	08
       *    BOTTOM PLAYER sitting position (facing up)
       * */
      describe("direction- clockwise", () => {
        const direction = MoveDirection.Clockwise;

        test("should return correct value for multi-step moves that start from the back", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(14),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for one-step moves that start from the back.", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(15),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for non-qualifying moves that start from the back", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(12),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for non-qualifying moves that start from the front", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(7),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for qualifying moves that start from the front", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(0),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });
      });

      describe("direction- anticlockwise", () => {
        const direction = MoveDirection.AntiClockwise;

        /*
         *    TOP PLAYER sitting position (facing down)
         *    00	01	02	03	04	05	06	07
         *    15	14	13	12	11	10	09	08
         *
         *    00	01	02	03	04	05	06	07
         *    15	14	13	12	11	10	09	08
         *    BOTTOM PLAYER sitting position (facing up)
         * */
        test("should return correct value for multi-step moves that start from the back", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(9),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for one-step moves that start from the back.", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(8),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });

        test("should return correct value for non-qualifying moves that start from the back", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(10),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for non-qualifying moves that start from the front", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(0),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(false);
        });

        test("should return correct value for qualifying moves that start from the front", () => {
          const move: Move = new Move(
            btmPlayerHoles.getHoleWithID(4),
            direction
          );
          expect(move.sowsSeedInFrontHole()).toBe(true);
        });
      });
    });
  });

  describe("#isValidCapture", () => {
    /* *  TOP PLAYER sitting position (facing down)
     *  00	01	02	03	04	05	06	07
     *  15	14	13	12	11	10	09	08
     *
     *  00	01	02	03	04	05	06	07
     *  15	14	13	12	11	10	09	08
     *   BOTTOM PLAYER sitting position (facing up)
     * */
    test("should correctly identify capture moves", () => {
      let move: Move = new Move(
        topPlayerHoles.getHoleWithID(1),
        MoveDirection.Clockwise
      );
      // top player hole 01 - clockwise does not capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(
        topPlayerHoles.getHoleWithID(1),
        MoveDirection.AntiClockwise
      );
      // top player hole 01 - anti-clockwise capture
      expect(move.isValidCapture()).toBe(true);

      move = new Move(topPlayerHoles.getHoleWithID(4), MoveDirection.Clockwise);
      // top player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(
        topPlayerHoles.getHoleWithID(4),
        MoveDirection.AntiClockwise
      );
      // top player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(btmPlayerHoles.getHoleWithID(1), MoveDirection.Clockwise);

      // bottom player hole 01 - clockwise does not capture
      expect(move.isValidCapture()).toBe(true);

      move = new Move(
        btmPlayerHoles.getHoleWithID(1),
        MoveDirection.AntiClockwise
      );
      // bottom player hole 01 - anti-clockwise capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(btmPlayerHoles.getHoleWithID(4), MoveDirection.Clockwise);
      // bottom  player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(true);

      move = new Move(
        btmPlayerHoles.getHoleWithID(4),
        MoveDirection.AntiClockwise
      );
      // bottom player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(true);
    });
  });

  describe("#isValidNonCapture", () => {
    /* *  TOP PLAYER sitting position (facing down)
     *  00	01	02	03	04	05	06	07
     *  15	14	13	12	11	10	09	08
     *
     *  00	01	02	03	04	05	06	07
     *  15	14	13	12	11	10	09	08
     *   BOTTOM PLAYER sitting position (facing up)
     * */

    test("should not accept move if a capture move exists", () => {
      const topPlayerHoles = board.topPlayer.boardHoles;
      // hole_08 clockwise sows in front row
      const move: Move = new Move(
        topPlayerHoles.getHoleWithID(8), // top_player_hole_08 has 2 seeds
        MoveDirection.AntiClockwise
      );
      expect(move.isValidNonCapture(true)).toBe(false);
    });

    test("should accept move that sows in the front row", () => {
      const board = Board.loadState(
        [0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0],
        null
      );
      const topPlayerHoles = board.topPlayer.boardHoles;
      // hole_08 clockwise sows in front row
      const move: Move = new Move(
        topPlayerHoles.getHoleWithID(8), // top_player_hole_08 has 20 seeds
        MoveDirection.AntiClockwise
      );
      expect(move.isValidNonCapture(true)).toBe(true);
    });

    test("should not accept move that does not sow in the front row", () => {
      const board = Board.loadState(
        [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
        null
      );
      const topPlayerHoles = board.topPlayer.boardHoles;
      // hole_08 anti-clockwise sows in back row only
      const move = new Move(
        topPlayerHoles.getHoleWithID(8), // top_player_hole_08 has 2 seeds
        MoveDirection.AntiClockwise
      );
      expect(move.isValidNonCapture(true)).toBe(false);
    });
  });
});
