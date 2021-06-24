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
import MtajiModeRules from "../../src/js/core/MtajiModeRules";
import PlayerBoardHoles from "../../src/js/core/PlayerBoardHoles";
import PlayerSide from "../../src/js/core/PlayerSide";
import TestHelper from "../TestHelper";

TestHelper.disableLogging();

describe("MtajiModeRules", () => {
  const rules: MtajiModeRules = new MtajiModeRules();
  const board: Board = new Board();
  const topPlayerHoles: PlayerBoardHoles = board.topPlayer.boardHoles;
  const btmPlayerHoles: PlayerBoardHoles = board.bottomPlayer.boardHoles;

  test("should not have home hole", () => {
    expect(new MtajiModeRules().hasHomeHole()).toBe(false);
  });

  test("should have correct initial seed placement", () => {
    const seedPlacement: Array<number> = [
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    ];
    expect(
      new MtajiModeRules().initialSeedForPlayerRows().get(PlayerSide.Bottom)
    ).toStrictEqual(seedPlacement);
    expect(
      new MtajiModeRules().initialSeedForPlayerRows().get(PlayerSide.Top)
    ).toStrictEqual(seedPlacement);
  });

  test("should compute correct move after a capture if performed", () => {
    /*  TOP PLAYER siitting position (facing down)
     *  00	01	02	03	04	05	06	07
     *  15	14	13	12	11	10	09	08
     *
     *  00	01	02	03	04	05	06	07
     *  15	14	13	12	11	10	09	08
     *  BOTTOM PLAYER sitting position (facing up) */

    // top player holes that reset back to hole_08 after clockwise- capture
    [8, 9, 10, 11].forEach((id) => {
      const hole: Hole = board.topPlayer.boardHoles.getHoleWithID(id);
      const move: Move = new Move(hole, MoveDirection.Clockwise);
      const nextMoveAfterCapture: Move =
        rules.nextContinuingMoveAfterCapture(move);
      expect(nextMoveAfterCapture.hole.id).toBe(8);
      expect(nextMoveAfterCapture.direction).toBe(MoveDirection.Clockwise);
      expect(nextMoveAfterCapture.isContinuing()).toBe(true);
      expect(nextMoveAfterCapture.prevContinuedMovesCount).toBe(1);
    });

    // top player holes that reset back to hole_08 after anticlockwise- capture
    [8, 9].forEach((id) => {
      const hole: Hole = board.topPlayer.boardHoles.getHoleWithID(id);
      const move: Move = new Move(hole, MoveDirection.AntiClockwise);
      const nextMoveAfterCapture: Move =
        rules.nextContinuingMoveAfterCapture(move);
      expect(nextMoveAfterCapture.hole.id).toBe(8);
      expect(nextMoveAfterCapture.direction).toBe(MoveDirection.Clockwise);
      expect(nextMoveAfterCapture.isContinuing()).toBe(true);
      expect(nextMoveAfterCapture.prevContinuedMovesCount).toBe(1);
    });

    // top player holes that reset back to hole_15 after anticlockwise- capture
    [12, 13, 14, 15].forEach((id) => {
      const hole: Hole = board.topPlayer.boardHoles.getHoleWithID(id);
      const move: Move = new Move(hole, MoveDirection.AntiClockwise);
      const nextMoveAfterCapture: Move =
        rules.nextContinuingMoveAfterCapture(move);
      expect(nextMoveAfterCapture.hole.id).toBe(15);
      expect(nextMoveAfterCapture.direction).toBe(MoveDirection.AntiClockwise);
      expect(nextMoveAfterCapture.isContinuing()).toBe(true);
      expect(nextMoveAfterCapture.prevContinuedMovesCount).toBe(1);
    });

    // top player holes that reset back to hole_15 after clockwise- capture
    [14, 15].forEach((id) => {
      const hole: Hole = board.topPlayer.boardHoles.getHoleWithID(id);
      const move: Move = new Move(hole, MoveDirection.Clockwise);
      const nextMoveAfterCapture: Move =
        rules.nextContinuingMoveAfterCapture(move);
      expect(nextMoveAfterCapture.hole.id).toBe(15);
      expect(nextMoveAfterCapture.direction).toBe(MoveDirection.AntiClockwise);
      expect(nextMoveAfterCapture.isContinuing()).toBe(true);
      expect(nextMoveAfterCapture.prevContinuedMovesCount).toBe(1);
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
      expect(rules.isValidCapture(move)).toBe(false);

      move = new Move(
        topPlayerHoles.getHoleWithID(1),
        MoveDirection.AntiClockwise
      );
      // top player hole 01 - anti-clockwise capture
      expect(rules.isValidCapture(move)).toBe(true);

      move = new Move(topPlayerHoles.getHoleWithID(4), MoveDirection.Clockwise);
      // top player hole 04 - clockwise does not capture
      expect(rules.isValidCapture(move)).toBe(false);

      move = new Move(
        topPlayerHoles.getHoleWithID(4),
        MoveDirection.AntiClockwise
      );
      // top player hole 04 - clockwise does not capture
      expect(rules.isValidCapture(move)).toBe(false);

      move = new Move(btmPlayerHoles.getHoleWithID(1), MoveDirection.Clockwise);

      // bottom player hole 01 - clockwise does not capture
      expect(rules.isValidCapture(move)).toBe(true);

      move = new Move(
        btmPlayerHoles.getHoleWithID(1),
        MoveDirection.AntiClockwise
      );
      // bottom player hole 01 - anti-clockwise capture
      expect(rules.isValidCapture(move)).toBe(false);

      move = new Move(btmPlayerHoles.getHoleWithID(4), MoveDirection.Clockwise);
      // bottom  player hole 04 - clockwise does not capture
      expect(rules.isValidCapture(move)).toBe(true);

      move = new Move(
        btmPlayerHoles.getHoleWithID(4),
        MoveDirection.AntiClockwise
      );
      // bottom player hole 04 - clockwise does not capture
      expect(rules.isValidCapture(move)).toBe(true);
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
      expect(rules.isValidNonCapture(move, true)).toBe(false);
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
      expect(rules.isValidNonCapture(move, true)).toBe(true);
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
      expect(rules.isValidNonCapture(move, true)).toBe(false);
    });
  });
});
