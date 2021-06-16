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
import Board from "../../src/js/core/Board";
import Move from "../../src/js/core/Move";
import Player from "../../src/js/core/Player";

/**
 * This is a helper method to check if the move status is correct for the
 * specified player side.
 *
 * @param moveStatus
 * @param player
 */
const checkMoveStatuses = (moveStatus: Array<string>, player: Player) => {
  for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
    expect(player.boardHoles.getHoleWithID(index).moveStatus.toString()).toBe(
      moveStatus[index]
    );
  }
};

describe("Board", () => {
  const board = new Board();

  test("should have top player", () => {
    expect(board.topPlayer.side).toBe("top");
  });

  test("should have bottom player", () => {
    expect(board.bottomPlayer.side).toBe("bottom");
  });

  test("should retrieve adjacent opponent holes", () => {
    const topPlayerHoles = board.topPlayer.boardHoles;
    expect(() =>
      board.adjacentOpponentHole(topPlayerHoles.getHoleWithID(0))
    ).toThrowError(
      "Attempted to retrieve adjacent opponent hole from a hole that is not in the front row | input: 0"
    );
    expect(board.adjacentOpponentHole(topPlayerHoles.getHoleWithID(8)).id).toBe(
      7
    );
    expect(
      board.adjacentOpponentHole(topPlayerHoles.getHoleWithID(11)).id
    ).toBe(4);
    expect(
      board.adjacentOpponentHole(topPlayerHoles.getHoleWithID(15)).id
    ).toBe(0);

    const bottomPlayerHoles = board.bottomPlayer.boardHoles;
    expect(() =>
      board.adjacentOpponentHole(bottomPlayerHoles.getHoleWithID(15))
    ).toThrowError(
      "Attempted to retrieve adjacent opponent hole from a hole that is not in the front row | input: 15"
    );
    expect(
      board.adjacentOpponentHole(bottomPlayerHoles.getHoleWithID(0)).id
    ).toBe(15);
    expect(
      board.adjacentOpponentHole(bottomPlayerHoles.getHoleWithID(4)).id
    ).toBe(11);
    expect(
      board.adjacentOpponentHole(bottomPlayerHoles.getHoleWithID(7)).id
    ).toBe(8);
  });

  describe("moves status", () => {
    test("initial moves status should be correct", () => {
      const topPlayerMoveStatus = [
        "A",
        "A",
        "L",
        "L",
        "L",
        "L",
        "C",
        "C",
        "C",
        "C",
        "B",
        "B",
        "B",
        "B",
        "A",
        "A",
      ];
      const btmPlayerMoveStatus = [
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
      ];
      checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
      checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);
    });

    test("switching player should update moves status", () => {
      board.switchPlayers();
      const btmPlayerMoveStatus = [
        "C",
        "C",
        "B",
        "B",
        "B",
        "B",
        "A",
        "A",
        "A",
        "A",
        "L",
        "L",
        "L",
        "L",
        "C",
        "C",
      ];
      const topPlayerMoveStatus = [
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
      ];
      checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
      checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);
    });
  });

  describe("#getOppossingEnemyHole", () => {
    /*
     *    TOP PLAYER sitting position (facing down)
     *    00	01	02	03	04	05	06	07
     *    15	14	13	12	11	10	09	08
     *
     *    00	01	02	03	04	05	06	07
     *    15	14	13	12	11	10	09	08
     *    BOTTOM PLAYER sitting position (facing up)
     * */
    test("should return correct id for opposing enemy holes", () => {
      const topPlayerHoles = board.topPlayer.boardHoles;
      expect(() => {
        board.getOppossingEnemyHole(topPlayerHoles.getHoleWithID(0));
      }).toThrowError("Could not retrieve opposing enemy hole");
      expect(
        board.getOppossingEnemyHole(topPlayerHoles.getHoleWithID(8)).id
      ).toBe(7);
      expect(
        board.getOppossingEnemyHole(topPlayerHoles.getHoleWithID(11)).id
      ).toBe(4);
      expect(
        board.getOppossingEnemyHole(topPlayerHoles.getHoleWithID(15)).id
      ).toBe(0);
      const bottomPlayerHoles = board.bottomPlayer.boardHoles;
      expect(() => {
        board.getOppossingEnemyHole(bottomPlayerHoles.getHoleWithID(15));
      }).toThrowError("Could not retrieve opposing enemy hole");
      expect(
        board.getOppossingEnemyHole(bottomPlayerHoles.getHoleWithID(7)).id
      ).toBe(8);
      expect(
        board.getOppossingEnemyHole(bottomPlayerHoles.getHoleWithID(4)).id
      ).toBe(11);
    });
  });

  describe("#getAllAvailableValidMoves", () => {
    let board: Board;
    beforeEach(() => {
      board = new Board();
    });

    test("should return all the moves that the current player can make.", () => {
      const moves: Array<Move> = board.getAllAvailableValidMoves(
        board.topPlayer
      );
      expect(moves.length).toBe(16);
      for (const move of moves) {
        expect(board.isValidMove(move)).toBe(true);
      }
    });

    test("opponent should not have any valid moves until its their turn", () => {
      const moves: Array<Move> = board.getAllAvailableValidMoves(
        board.bottomPlayer
      );
      expect(moves.length).toBe(0);
    });

    test("should update move status when a move has been executed - player sides switched", () => {
      let moves: Array<Move> = board.getAllAvailableValidMoves(board.topPlayer);
      board.executeMove(moves[0]);
      moves = board.getAllAvailableValidMoves(board.bottomPlayer);
      expect(moves.length).toBe(9);

      moves = board.getAllAvailableValidMoves(board.topPlayer);
      expect(moves.length).toBe(0);
    });
  });

  describe("#loadState", () => {
    test("should load seed arrangement state correctly", () => {
      const topPlayerSeedConfig = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ];
      const btmPlayerSeedConfig = [
        1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 5, 6, 6, 7, 7,
      ];
      const board = Board.loadState(topPlayerSeedConfig, btmPlayerSeedConfig);
      //check player seed placement
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        expect(board.topPlayer.boardHoles.getHoleWithID(index).numSeeds).toBe(
          topPlayerSeedConfig[index]
        );
        expect(
          board.bottomPlayer.boardHoles.getHoleWithID(index).numSeeds
        ).toBe(btmPlayerSeedConfig[index]);
      }
    });
  });
});
