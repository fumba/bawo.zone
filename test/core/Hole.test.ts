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

import Hole from "../../src/js/core/Hole";
import MoveDirection from "../../src/js/core/MoveDirection";
import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";

describe("Hole", () => {
  const player = new Player(PlayerSide.Bottom);
  // hole 3, hole 4, hole 5
  const hole_03: Hole = new Hole(null, null, 3, 0, null, null);
  const hole_05: Hole = new Hole(null, null, 5, 0, null, null);

  let hole_04: Hole;
  beforeEach(() => {
    hole_04 = new Hole(player, null, 4, 33, hole_03, hole_05);
  });

  test("should assign hole id", () => {
    expect(hole_04.id).toBe(4);
  });

  test("should initialise hole with move status - unathorized", () => {
    expect(hole_04.moveStatus).toBe(MoveDirection.UnAuthorised);
  });

  test("should initialise hole with move status - unathorized", () => {
    expect(hole_04.prevHole).toBe(hole_03);
  });

  test("should initialise hole with move status - unathorized", () => {
    expect(hole_04.nextHole).toBe(hole_05);
  });

  test("should assign seeds", () => {
    expect(hole_04.numSeeds).toBe(33);
  });

  describe("#isInFrontRow", () => {
    test("should be true when hole is in the front row for the given player", () => {
      const topPlayer: Player = new Player(PlayerSide.Top);
      const bottomPlayer: Player = new Player(PlayerSide.Bottom);
      let hole: Hole;
      for (let hole_id = 0; hole_id <= 7; hole_id++) {
        hole = new Hole(topPlayer, null, hole_id, 0, null, null);
        expect(hole.isInFrontRow()).toBe(false);
        hole = new Hole(bottomPlayer, null, hole_id, 0, null, null);
        expect(hole.isInFrontRow()).toBe(true);
      }
      for (let hole_id = 8; hole_id <= 15; hole_id++) {
        hole = new Hole(topPlayer, null, hole_id, 0, null, null);
        expect(hole.isInFrontRow()).toBe(true);
        hole = new Hole(bottomPlayer, null, hole_id, 0, null, null);
        expect(hole.isInFrontRow()).toBe(false);
      }
    });
  });

  describe("#isEmpty", () => {
    test("should be true when hole has no seeds", () => {
      const hole = new Hole(player, null, 4, 0, hole_03, hole_05);
      expect(hole.isEmpty()).toBe(true);
    });

    test("should be false when hole has seeds", () => {
      const hole = new Hole(player, null, 4, 33, hole_03, hole_05);
      expect(hole.isEmpty()).toBe(false);
    });
  });
});
