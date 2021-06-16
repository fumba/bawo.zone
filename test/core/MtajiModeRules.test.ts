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
import PlayerSide from "../../src/js/core/PlayerSide";

describe("MtajiModeRules", () => {
  const rules: MtajiModeRules = new MtajiModeRules();
  const board: Board = new Board();

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
      const move: Move = new Move( hole, MoveDirection.AntiClockwise);
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
});
