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
import MoveDirection from "../../src/js/core/MoveDirection";
import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";
import TestHelper from "../TestHelper";

const me = TestHelper.me;
TestHelper.disableLogging();

describe("Hole", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  test("should initialize hole with move status - unauthorized", () => {
    expect(hole_04.moveStatus).toBe(MoveDirection.UnAuthorized);
  });

  test("should initialize hole with move status - unauthorized", () => {
    expect(hole_04.prevHole).toBe(hole_03);
  });

  test("should initialize hole with move status - unauthorized", () => {
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

  describe("#transferAllSeedsToCurrPlayer", () => {
    test("should move seed to player UI (when graphics is on)", () => {
      const board = new Board(me);
      board.topPlayer.boardHoles
        .getHoleWithID(1)
        .transferAllSeedsToCurrPlayer();
      expect(board.uiTaskQueue.length).toBe(1);
    });
  });

  describe("#transferSeedsFromCurrPlayer", () => {
    let board: Board;
    let hole: Hole;
    beforeEach(() => {
      board = new Board(me);
      hole = board.topPlayer.boardHoles.getHoleWithID(1);
    });

    test("should move seed to UI hole (when graphics is on)", () => {
      board.getCurrentPlayer().numSeedsInHand = 10;
      hole.transferSeedsFromCurrPlayer(2);
      expect(board.uiTaskQueue.length).toBe(2);
    });

    test("should remove correct number of seeds", () => {
      board.getCurrentPlayer().numSeedsInHand = 10;
      hole.transferSeedsFromCurrPlayer(2);
      expect(board.getCurrentPlayer().numSeedsInHand).toBe(8);
      hole.transferSeedsFromCurrPlayer(1);
      expect(board.getCurrentPlayer().numSeedsInHand).toBe(7);
    });

    test("should not allow seeds to be removed from an empty hand", () => {
      expect(() => hole.transferSeedsFromCurrPlayer(1)).toThrow(
        "Total number of seeds after operation is negative | input: -1"
      );
    });

    test("should not allow zero seeds to be removed", () => {
      expect(() => hole.transferSeedsFromCurrPlayer(0)).toThrow(
        "Attempted to add or remove no seeds"
      );
    });

    test("should not allow player to remove negative number of seeds", () => {
      expect(() => hole.transferSeedsFromCurrPlayer(-1)).toThrow(
        "Attempted to add or remove negative number seeds | input : -1"
      );
    });
  });

  describe("#isOwnedByCurrentPlayer", () => {
    test("should return true if the current player owns the hole", () => {
      expect(
        new Board().topPlayer.boardHoles
          .getHoleWithID(1)
          .availableMovesForCurrentPlayer().length
      ).toBe(1);
      expect(
        new Board().topPlayer.boardHoles
          .getHoleWithID(12) //BOTH directions can be played
          .availableMovesForCurrentPlayer().length
      ).toBe(2);
    });

    test("should return false if the current player does not own the hole", () => {
      const board = new Board();
      const hole = board.topPlayer.boardHoles.getHoleWithID(1);
      //switch players
      board.switchPlayers();
      expect(hole.availableMovesForCurrentPlayer().length).toBe(0);
      expect(
        board.topPlayer.boardHoles
          .getHoleWithID(12) //BOTH directions can be played
          .availableMovesForCurrentPlayer().length
      ).toBe(0);
    });
  });

  describe("#adjacencyDirection", () => {
    test("should return anticlockwise for previous adjacent holes", () => {
      const board = new Board();
      const startHole = board.topPlayer.boardHoles.getHoleWithID(12);
      const destinationHole = board.topPlayer.boardHoles.getHoleWithID(11);
      expect(startHole.adjacencyDirection(destinationHole)).toBe(
        MoveDirection.AntiClockwise
      );
    });

    test("should return clockwise for next adjacent holes", () => {
      const board = new Board();
      const startHole = board.topPlayer.boardHoles.getHoleWithID(12);
      const destinationHole = board.topPlayer.boardHoles.getHoleWithID(13);
      expect(startHole.adjacencyDirection(destinationHole)).toBe(
        MoveDirection.Clockwise
      );
    });

    test("should return null if drag and drop performed on same hole", () => {
      const board = new Board();
      const startHole = board.topPlayer.boardHoles.getHoleWithID(12);
      expect(startHole.adjacencyDirection(startHole)).toBe(null);
    });

    test("should return null for invalid moves", () => {
      const board = new Board();
      const startHole = board.topPlayer.boardHoles.getHoleWithID(0);
      const destinationHole = board.topPlayer.boardHoles.getHoleWithID(1);
      expect(startHole.adjacencyDirection(destinationHole)).toBe(null);
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
