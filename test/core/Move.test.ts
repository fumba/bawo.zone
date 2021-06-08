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
    const move: Move = new Move(board, hole, direction);
    expect(move.prevContinuedMovesCount).toBe(0);
    expect(move.board).toBe(board);
    expect(move.hole).toBe(hole);
    expect(move.direction).toBe(direction);
  });

  describe("#isContinuing", () => {
    const move: Move = new Move(board, hole, direction);
    test("should correctly identify moves that are not continuing", () => {
      expect(move.isContinuing()).toBe(false);
    });

    test("should correctly identify moves that are continuing", () => {
      move.prevContinuedMovesCount = 1;
      expect(move.isContinuing()).toBe(true);
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
        board,
        topPlayerHoles.getHoleWithID(1),
        MoveDirection.Clockwise
      );
      // top player hole 01 - clockwise does not capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(
        board,
        topPlayerHoles.getHoleWithID(1),
        MoveDirection.AntiClockwise
      );
      // top player hole 01 - anti-clockwise capture
      expect(move.isValidCapture()).toBe(true);

      move = new Move(
        board,
        topPlayerHoles.getHoleWithID(4),
        MoveDirection.Clockwise
      );
      // top player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(
        board,
        topPlayerHoles.getHoleWithID(4),
        MoveDirection.AntiClockwise
      );
      // top player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(
        board,
        btmPlayerHoles.getHoleWithID(1),
        MoveDirection.Clockwise
      );

      // bottom player hole 01 - clockwise does not capture
      expect(move.isValidCapture()).toBe(true);

      move = new Move(
        board,
        btmPlayerHoles.getHoleWithID(1),
        MoveDirection.AntiClockwise
      );
      // bottom player hole 01 - anti-clockwise capture
      expect(move.isValidCapture()).toBe(false);

      move = new Move(
        board,
        btmPlayerHoles.getHoleWithID(4),
        MoveDirection.Clockwise
      );
      // bottom  player hole 04 - clockwise does not capture
      expect(move.isValidCapture()).toBe(true);

      move = new Move(
        board,
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

    test("should accept moves that sow in the front row", () => {
      const board = Board.loadState(
        [0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0],
        null
      );
      const topPlayerHoles = board.topPlayer.boardHoles;
      // hole_08 clockwise sows in front row
      const move: Move = new Move(
        board,
        topPlayerHoles.getHoleWithID(8), // top_player_hole_08 has 20 seeds
        MoveDirection.AntiClockwise
      );
      expect(move.isValidNonCapture()).toBe(true);
    });

    test("should not accept moves that do not sow in the front row", () => {
      const board = Board.loadState(
        [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
        null
      );
      const topPlayerHoles = board.topPlayer.boardHoles;
      // hole_08 anti-clockwise sows in back row only
      const move = new Move(
        board,
        topPlayerHoles.getHoleWithID(8), // top_player_hole_08 has 2 seeds
        MoveDirection.AntiClockwise
      );
      expect(move.isValidNonCapture()).toBe(false);
    });
  });
});
