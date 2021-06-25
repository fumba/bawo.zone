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
import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";

describe("Player", () => {
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

  describe("remove seeds from hand", () => {
    let player: Player;
    const hole = new Board().topPlayer.boardHoles.getHoleWithID(1);
    beforeEach(() => {
      player = new Player(PlayerSide.Top);
    });
    test("should remove correct number of seeds", () => {
      player.numSeedsInHand = 10;
      player.moveSeedsIntoBoardHole(2, hole);
      expect(player.numSeedsInHand).toBe(8);
      player.moveSeedsIntoBoardHole(1, hole);
      expect(player.numSeedsInHand).toBe(7);
    });

    test("should not allow seeds to be removed from an empty hand", () => {
      expect(() => player.moveSeedsIntoBoardHole(1, hole)).toThrow(
        "Total number of seeds after operation is negative | input: -1"
      );
    });

    test("should not allow zero seeds to be removed", () => {
      expect(() => player.moveSeedsIntoBoardHole(0, hole)).toThrow(
        "Attempted to add or remove no seeds"
      );
    });

    test("should not allow player to remove negative number of seeds", () => {
      expect(() => player.moveSeedsIntoBoardHole(-1, hole)).toThrow(
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
});
