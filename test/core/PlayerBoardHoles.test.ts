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

import AppConstants from "../../src/js/core/AppConstants";
import Player from "../../src/js/core/Player";
import PlayerBoardHoles from "../../src/js/core/PlayerBoardHoles";
import PlayerSide from "../../src/js/core/PlayerSide";

describe("PlayerBoardHoles", () => {
  const player = new Player(PlayerSide.Top);
  const numSeeds = 2;

  //https://stackoverflow.com/a/15913802
  const floorMod = function (a: number, n: number) {
    return a - n * Math.floor(a / n);
  };

  describe("#[Symbol.iterator]", () => {
    test("should iterate through all the holes", () => {
      const holeIds = [];
      const playerBoardHoles: PlayerBoardHoles = new PlayerBoardHoles(
        player,
        null
      );
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        playerBoardHoles.insertAtEnd(numSeeds);
      }
      for (const hole of playerBoardHoles) {
        holeIds.push(hole.id);
      }
      expect(holeIds).toStrictEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);
    });
  });

  describe("#getHoleWithId", () => {
    test("should not allow player access if all the holes are not initialised", () => {
      expect(() => new PlayerBoardHoles(player, null).getHoleWithID(0)).toThrow(
        "All 16 holes belonging to the player must be added to the board before accessing them."
      );
    });

    describe("initialise player holes", () => {
      let playerBoardHoles: PlayerBoardHoles;
      beforeEach(() => {
        playerBoardHoles = new PlayerBoardHoles(player, null);
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
        const playerBoardHoles = new PlayerBoardHoles(player, null);
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

  describe("#stepAntiClockwise", () => {
    let playerBoardHoles: PlayerBoardHoles;
    beforeEach(() => {
      playerBoardHoles = new PlayerBoardHoles(player, null);
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        playerBoardHoles.insertAtEnd(numSeeds);
      }
    });
    test("should not be able to perform less than one step", () => {
      const hole_00 = playerBoardHoles.getHoleWithID(0);

      //try taking 0 steps
      expect(() => {
        playerBoardHoles.stepAntiClockwise(hole_00, 0);
      }).toThrow("Number of steps should be within range 0-64 | Requested : 0");
      //try taking -1 steps
      expect(() => {
        playerBoardHoles.stepAntiClockwise(hole_00, -1);
      }).toThrow(
        "Number of steps should be within range 0-64 | Requested : -1"
      );
    });

    test("should not be able to perform more than 64 steps", () => {
      const hole_00 = playerBoardHoles.getHoleWithID(0);
      expect(() => {
        playerBoardHoles.stepAntiClockwise(hole_00, 65);
      }).toThrow(
        "Number of steps should be within range 0-64 | Requested : 65"
      );
    });

    test("should step anti-clockwise for allowed step range on all player holes", () => {
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        const startHole = playerBoardHoles.getHoleWithID(id);
        for (let steps = 1; steps <= AppConstants.MAX_SEED_COUNT; steps++) {
          const destinationHole = playerBoardHoles.stepAntiClockwise(
            startHole,
            steps
          );
          expect(destinationHole.id).toBe(
            floorMod(id - steps, AppConstants.NUM_PLAYER_HOLES)
          );
        }
      }
    });
  });

  describe("#stepClockwise", () => {
    let playerBoardHoles: PlayerBoardHoles;
    beforeEach(() => {
      playerBoardHoles = new PlayerBoardHoles(player, null);
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        playerBoardHoles.insertAtEnd(numSeeds);
      }
    });
    test("should not be able to perform less than one step", () => {
      const hole_00 = playerBoardHoles.getHoleWithID(0);

      //try taking 0 steps
      expect(() => {
        playerBoardHoles.stepClockwise(hole_00, 0);
      }).toThrow("Number of steps should be within range 0-64 | Requested : 0");
      //try taking -1 steps
      expect(() => {
        playerBoardHoles.stepClockwise(hole_00, -1);
      }).toThrow(
        "Number of steps should be within range 0-64 | Requested : -1"
      );
    });

    test("should not be able to perform more than 64 steps", () => {
      const hole_00 = playerBoardHoles.getHoleWithID(0);
      expect(() => {
        playerBoardHoles.stepClockwise(hole_00, 65);
      }).toThrow(
        "Number of steps should be within range 0-64 | Requested : 65"
      );
    });

    test("should step clockwise for allowed step range on all player holes", () => {
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        const startHole = playerBoardHoles.getHoleWithID(id);
        for (let steps = 1; steps <= AppConstants.MAX_SEED_COUNT; steps++) {
          const destinationHole = playerBoardHoles.stepClockwise(
            startHole,
            steps
          );
          expect(destinationHole.id).toBe(
            floorMod(id + steps, AppConstants.NUM_PLAYER_HOLES)
          );
        }
      }
    });
  });

  describe("#toString", () => {
    test("should show string representation of player board holes", () => {
      const playerBoardHoles = new PlayerBoardHoles(player, null);
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        playerBoardHoles.insertAtEnd(numSeeds);
      }
      expect(playerBoardHoles.toString()).toBe(
        `[00(02)-X]  [01(02)-X]  [02(02)-X]  [03(02)-X]  [04(02)-X]  [05(02)-X]  [06(02)-X]  [07(02)-X]  \n[15(02)-X]  [14(02)-X]  [13(02)-X]  [12(02)-X]  [11(02)-X]  [10(02)-X]  [09(02)-X]  [08(02)-X]  \n`
      );
    });
  });
});
