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
import Hole from "../../src/js/core/Hole";
import Move from "../../src/js/core/Move";
import MoveDirection from "../../src/js/core/MoveDirection";
import Player from "../../src/js/core/Player";
import PlayerSide from "../../src/js/core/PlayerSide";
import TestHelper from "../TestHelper";
import YokhomaModeRules from "../../src/js/core/rules/YokhomaModeRules";

TestHelper.disableLogging();

const me = TestHelper.me;

/**
 * This is a helper method to check if the move status is correct for the
 * specified player side.
 *
 * @param {Array<string>} moveStatus an array with expected move statuses
 * @param {Player} player player making the move
 */
const checkMoveStatuses = (moveStatus: Array<string>, player: Player) => {
  for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
    expect(player.boardHoles.getHoleWithID(index).moveStatus.toString()).toBe(
      moveStatus[index]
    );
  }
};

/**
 * This is a helper method to check if the seed configuration is correct for the
 * specified player side.
 *
 * @param {Array<number>} playerSeeds player seeds
 * @param {Player} player player
 */
const checkSeedConfiguration = (playerSeeds: Array<number>, player: Player) => {
  for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
    expect(player.boardHoles.getHoleWithID(id).numSeeds).toBe(playerSeeds[id]);
  }
};

describe("Board", () => {
  const board = new Board();

  test("should have top player", () => {
    expect(board.topPlayer.side).toBe("T");
  });

  test("should have bottom player", () => {
    expect(board.bottomPlayer.side).toBe("B");
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

  describe("initialize game with yokhoma rules", () => {
    test("should correctly initialize game", () => {
      expect(() =>
        new Board(null, new YokhomaModeRules()).validateUiState()
      ).not.toThrowError();
    });
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

  describe("#getOpposingEnemyHole", () => {
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
        board.getOpposingEnemyHole(topPlayerHoles.getHoleWithID(0));
      }).toThrowError("Could not retrieve opposing enemy hole");
      expect(
        board.getOpposingEnemyHole(topPlayerHoles.getHoleWithID(8)).id
      ).toBe(7);
      expect(
        board.getOpposingEnemyHole(topPlayerHoles.getHoleWithID(11)).id
      ).toBe(4);
      expect(
        board.getOpposingEnemyHole(topPlayerHoles.getHoleWithID(15)).id
      ).toBe(0);
      const bottomPlayerHoles = board.bottomPlayer.boardHoles;
      expect(() => {
        board.getOpposingEnemyHole(bottomPlayerHoles.getHoleWithID(15));
      }).toThrowError("Could not retrieve opposing enemy hole");
      expect(
        board.getOpposingEnemyHole(bottomPlayerHoles.getHoleWithID(7)).id
      ).toBe(8);
      expect(
        board.getOpposingEnemyHole(bottomPlayerHoles.getHoleWithID(4)).id
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

  describe("#switchPlayers", () => {
    test("should not allow players to switch while someone has seeds in hands", () => {
      board.bottomPlayer.numSeedsInHand = 5;
      expect(() => board.switchPlayers()).toThrowError();
    });
  });

  describe("#isValidMove", () => {
    test("should have a starting hole specified", () => {
      expect(() => {
        const move: Move = new Move(null, MoveDirection.Clockwise);
        board.isValidMove(move);
      }).toThrow("Move is required to have a starting hole specified.");
    });

    test("should not allow players to make moves on holes that do not belong to them", () => {
      let move: Move;
      const board = new Board();
      // bottom player attempting to make moves on top holes
      board.switchPlayers();
      for (const hole of board.topPlayer.boardHoles) {
        move = new Move(hole, MoveDirection.Clockwise);
        expect(() => {
          board.isValidMove(move);
        }).toThrow(
          "Player " +
            board.bottomPlayer.toString() +
            " is not allowed to make a move on hole " +
            hole.toString()
        );
      }
      // top player attempting to make moves on bottom holes
      board.switchPlayers();
      for (const hole of board.bottomPlayer.boardHoles) {
        move = new Move(hole, MoveDirection.Clockwise);
        expect(() => {
          board.isValidMove(move);
        }).toThrow(
          "Player " +
            board.topPlayer.toString() +
            " is not allowed to make a move on hole " +
            hole.toString()
        );
      }
    });

    test("move should not be null", () => {
      expect(() => {
        board.isValidMove(null);
      }).toThrow("Move is null.");
    });

    test("should have direction specified.", () => {
      expect(() => {
        const move: Move = new Move(
          board.topPlayer.boardHoles.getHoleWithID(1),
          null
        );
        board.isValidMove(move);
      }).toThrow("Move is required to have its direction specified.");
    });

    test("should return correct value for move validity status.", () => {
      const board: Board = new Board();

      // the indices of these arrays represent the id of the hole.
      const topPlayerClockwiseMoveValidity: Array<boolean> = [
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
      ];

      // the indices of these arrays represent the id of the hole.
      const topPlayerAntiClockwiseMoveValidity: Array<boolean> = [
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
      ];

      // the indices of these arrays represent the id of the hole.
      const bottomPlayerClockwiseMoveValidity: Array<boolean> = [
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
      ];

      // the indices of these arrays represent the id of the hole.
      const bottomPlayerAntiClockwiseMoveValidity: Array<boolean> = [
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
      ];

      let move;
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        const hole: Hole = board.topPlayer.boardHoles.getHoleWithID(id);
        move = new Move(hole, MoveDirection.Clockwise);
        expect(board.isValidMove(move)).toBe(
          topPlayerClockwiseMoveValidity[id]
        );

        move = new Move(hole, MoveDirection.AntiClockwise);
        expect(board.isValidMove(move)).toBe(
          topPlayerAntiClockwiseMoveValidity[id]
        );
      }

      // Switch sides to bottom player
      board.switchPlayers();
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        const hole: Hole = board.bottomPlayer.boardHoles.getHoleWithID(id);
        move = new Move(hole, MoveDirection.Clockwise);
        expect(board.isValidMove(move)).toBe(
          bottomPlayerClockwiseMoveValidity[id]
        );

        move = new Move(hole, MoveDirection.AntiClockwise);
        expect(board.isValidMove(move)).toBe(
          bottomPlayerAntiClockwiseMoveValidity[id]
        );
      }
    });
  });

  // describe("#validateUIState", () => {
  //   test("should make sure that there are always 64 seed UI entities on the canvas", () => {
  //     me.game.world.getChildByType.mockReturnValue(["seed", "seed"]); //two seeds only on board
  //     expect(() => new Board(me).validateUiState()).toThrowError(
  //       "UI State has 2 seeds present. There should always be 64 seeds in play"
  //     );
  //   });
  // });

  describe("#isGameOver", () => {
    test("should be false when the game hasn't ended yet", () => {
      expect(board.isGameOver()).toBe(false);
    });

    //game over true is indirectly tested in #executeMove - simulation and infinite move
  });

  describe("#getWinningPlayer", () => {
    test("should throw error when invoked while the game hasn't ended yet", () => {
      expect(() => board.getWinningPlayer()).toThrowError(
        "The game is still in play. There is no winning player yet."
      );
    });

    //determining winning player happy path is tested in #executeMove - simulation
  });

  describe("#clone", () => {
    test("should correctly clone seed placement on a board", () => {
      const board: Board = new Board();
      expect(board.clone().toString()).toBe(board.toString());
    });

    test("should assign correct current player", () => {
      const board: Board = new Board();
      board.switchPlayers();
      expect(board.clone().getCurrentPlayer().side).toBe(
        board.getCurrentPlayer().side
      );
    });
  });

  describe("#getScore", () => {
    test("should throw error when invoked while player has seeds in hand", () => {
      const board = new Board();
      board.topPlayer.numSeedsInHand = 3;
      board.bottomPlayer.numSeedsInHand = 0;
      expect(() => board.getScore()).toThrowError(
        "Score cannot be determined while one of the players is holding seeds in hand."
      );
      board.topPlayer.numSeedsInHand = 0;
      board.bottomPlayer.numSeedsInHand = 2;
      expect(() => board.getScore()).toThrowError(
        "Score cannot be determined while one of the players is holding seeds in hand."
      );
    });

    test("should compute correct score when current player falls into infinite loop", () => {
      const board = new Board();
      const move = new Move(
        board.topPlayer.boardHoles.getHoleWithID(1),
        MoveDirection.Clockwise,
        AppConstants.INFINITE_LOOP_THRESHOLD
      );
      board.executeMove(move);
      const expectedScores = new Map<PlayerSide, number>();
      expectedScores.set(PlayerSide.Bottom, 64);
      expectedScores.set(PlayerSide.Top, 0);
      expect(board.getScore()).toStrictEqual(expectedScores);
    });

    test("should compute correct score during normal game play", () => {
      const board = new Board();
      const expectedScores = new Map<PlayerSide, number>();
      expectedScores.set(PlayerSide.Bottom, 32);
      expectedScores.set(PlayerSide.Top, 32);
      expect(board.getScore()).toStrictEqual(expectedScores);
    });

    test("should throw error if score total is not 64", () => {
      const board = new Board();
      board.topPlayer.boardHoles.getHoleWithID(12).numSeeds = 40; //add extra seeds to hole
      expect(() => board.getScore()).toThrowError(
        "Total score is not 64. Got : 102"
      );
    });
  });

  describe("#executeMove", () => {
    test("should make sure that players only make moves on their own holes", () => {
      const board = new Board();
      const move = new Move(
        board.bottomPlayer.boardHoles.getHoleWithID(1),
        MoveDirection.Clockwise
      );
      expect(() => board.executeMove(move)).toThrow();
    });

    test("should detect when the game falls into a continuous loop", () => {
      const board = new Board();
      const move = new Move(
        board.topPlayer.boardHoles.getHoleWithID(1),
        MoveDirection.Clockwise,
        AppConstants.INFINITE_LOOP_THRESHOLD
      );
      board.executeMove(move);
      expect(board.isGameOver()).toBe(true);
      expect(board.topPlayer.numSeedsInHand).toBe(0);
    });

    test("should not allow invalid moves on the board", () => {
      const board = new Board();
      const move = new Move(
        board.topPlayer.boardHoles.getHoleWithID(4),
        MoveDirection.Clockwise
      );
      expect(board.executeMove(move)).toBe(false);
    });

    test("should only allow clockwise and anticlockwise moves", () => {
      const board = new Board();
      let move = new Move(
        board.topPlayer.boardHoles.getHoleWithID(4),
        MoveDirection.Both
      );
      expect(() => board.executeMove(move)).toThrowError(
        "Only Clockwise and Anticlockwise moves are allowed. Input : B"
      );

      move = new Move(
        board.topPlayer.boardHoles.getHoleWithID(4),
        MoveDirection.Locked
      );
      expect(() => board.executeMove(move)).toThrowError(
        "Only Clockwise and Anticlockwise moves are allowed. Input : L"
      );

      move = new Move(
        board.topPlayer.boardHoles.getHoleWithID(4),
        MoveDirection.UnAuthorized
      );
      expect(() => board.executeMove(move)).toThrowError(
        "Only Clockwise and Anticlockwise moves are allowed. Input : X"
      );
    });
  });

  test("#executeMove - Game play simulation", () => {
    /** This is a simulation of an actual game play */

    // The Top Player is the current player by default but in this simulation they wont be starting the game.
    // This is done by switching players to the bottom player
    const board = new Board();
    expect(board.getCurrentPlayer().side).toBe(PlayerSide.Top);
    // Confirm initial seed arrangement
    let topPlayerSeedConfig = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    let btmPlayerSeedConfig = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    // Confirm initial move statuses
    let topPlayerMoveStatus = [
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
    const allBlockedStatus = [
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
    let btmPlayerMoveStatus = allBlockedStatus;
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // >> switch to Bottom player who will start the game...
    board.switchPlayers();
    expect(board.getCurrentPlayer().side).toBe(PlayerSide.Bottom);

    const bottomPlayerHoles = board.bottomPlayer.boardHoles;
    const topPlayerHoles = board.topPlayer.boardHoles;

    // MOVE 1 - Bottom Player (Hole 7 anti-clockwise)
    let move: Move;
    move = new Move(
      bottomPlayerHoles.getHoleWithID(7),
      MoveDirection.AntiClockwise
    );
    expect(board.executeMove(move)).toBe(true);
    // check how the move affected the board seed configuration
    topPlayerSeedConfig = [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0]; // 0's are holes that were captured by bottom player during this move
    btmPlayerSeedConfig = [5, 1, 4, 4, 4, 0, 1, 3, 3, 3, 0, 3, 3, 0, 3, 3];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    // top player is now the current player
    topPlayerMoveStatus = [
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "C",
      "L",
      "L",
      "L",
      "L",
      "C",
      "L",
      "A",
      "L",
      "L",
    ];
    btmPlayerMoveStatus = allBlockedStatus; // Bottom player is not allowed to play
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // MOVE 2 - Top Player (Hole 13 Anti-clockwise)
    move = new Move(
      topPlayerHoles.getHoleWithID(13),
      MoveDirection.AntiClockwise
    );
    expect(board.executeMove(move)).toBe(true);
    topPlayerSeedConfig = [4, 1, 0, 4, 1, 4, 0, 1, 6, 4, 0, 2, 3, 5, 1, 6];
    btmPlayerSeedConfig = [0, 0, 4, 0, 0, 0, 0, 0, 3, 3, 0, 3, 3, 0, 3, 3];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    btmPlayerMoveStatus = [
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "C",
    ];
    topPlayerMoveStatus = allBlockedStatus; // Top player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // MOVE 3 - Bottom Player (Hole 15 Clockwise)
    move = new Move(
      bottomPlayerHoles.getHoleWithID(15),
      MoveDirection.Clockwise
    );
    expect(board.executeMove(move)).toBe(true);
    topPlayerSeedConfig = [4, 1, 0, 4, 1, 4, 0, 1, 6, 4, 0, 2, 3, 0, 1, 6];
    btmPlayerSeedConfig = [2, 2, 6, 1, 1, 0, 0, 0, 3, 3, 0, 3, 3, 0, 3, 0];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    topPlayerMoveStatus = [
      "A",
      "L",
      "L",
      "A",
      "L",
      "L",
      "L",
      "L",
      "C",
      "L",
      "L",
      "L",
      "C",
      "L",
      "L",
      "L",
    ];
    btmPlayerMoveStatus = allBlockedStatus; // Bottom player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // MOVE 4 - Top Player (Hole 3 Anti-clockwise)
    move = new Move(
      topPlayerHoles.getHoleWithID(3),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);
    topPlayerSeedConfig = [1, 4, 3, 2, 3, 1, 2, 3, 0, 6, 0, 5, 6, 3, 2, 1];
    btmPlayerSeedConfig = [0, 0, 6, 1, 0, 0, 0, 0, 3, 3, 0, 3, 3, 0, 3, 0];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    btmPlayerMoveStatus = [
      "L",
      "L",
      "B",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
    ];
    topPlayerMoveStatus = allBlockedStatus; // Top player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // MOVE 5 - Bottom Player (Hole 2 Anti-clockwise)
    move = new Move(
      bottomPlayerHoles.getHoleWithID(2),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);
    // topPlayerSeedConfig is unchanged since this is a non-capturing move
    btmPlayerSeedConfig = [1, 1, 0, 1, 1, 1, 1, 1, 0, 4, 1, 4, 0, 1, 4, 1];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    topPlayerMoveStatus = [
      "L",
      "L",
      "A",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "C",
      "L",
      "L",
      "L",
      "L",
      "A",
      "L",
    ];
    btmPlayerMoveStatus = allBlockedStatus; // Bottom player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // MOVE 6 - Top Player (Hole 14 Anti-clockwise)
    move = new Move(
      topPlayerHoles.getHoleWithID(14),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);
    topPlayerSeedConfig = [1, 6, 0, 4, 1, 3, 4, 0, 2, 8, 2, 7, 1, 1, 4, 1];
    btmPlayerSeedConfig = [0, 0, 0, 0, 1, 1, 1, 1, 0, 4, 1, 4, 0, 1, 4, 1];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    btmPlayerMoveStatus = [
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "A",
      "L",
      "A",
      "L",
      "L",
      "L",
      "L",
    ];
    topPlayerMoveStatus = allBlockedStatus; // Top player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // Important: Only outer row moves are available for the bottom player at this
    // point...
    move = new Move(
      bottomPlayerHoles.getHoleWithID(9),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);
    topPlayerSeedConfig = [1, 6, 0, 4, 1, 3, 4, 0, 2, 0, 0, 7, 1, 1, 4, 1];
    btmPlayerSeedConfig = [1, 1, 1, 1, 2, 3, 4, 4, 1, 0, 1, 4, 0, 1, 4, 1];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    topPlayerMoveStatus = [
      "L",
      "A",
      "L",
      "A",
      "L",
      "C",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
    ];
    btmPlayerMoveStatus = allBlockedStatus; // Bottom player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    move = new Move(topPlayerHoles.getHoleWithID(5), MoveDirection.Clockwise);
    board.executeMove(move);
    topPlayerSeedConfig = [1, 9, 0, 1, 0, 3, 0, 4, 2, 1, 7, 5, 7, 0, 10, 1];
    btmPlayerSeedConfig = [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 4, 0, 1, 4, 1];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    btmPlayerMoveStatus = [
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "A",
      "L",
      "L",
      "C",
      "L",
    ];
    topPlayerMoveStatus = allBlockedStatus; // Top player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    move = new Move(
      bottomPlayerHoles.getHoleWithID(14),
      MoveDirection.Clockwise
    );
    board.executeMove(move);
    // topPlayerSeedConfig doesn't change because move is non-capturing
    btmPlayerSeedConfig = [1, 2, 1, 0, 0, 0, 0, 0, 1, 0, 1, 4, 0, 1, 0, 2];
    checkSeedConfiguration(topPlayerSeedConfig, board.topPlayer);
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);
    // Important: Non-capturing moves at the front lines only... takata is not allowed on the bottom
    topPlayerMoveStatus = [
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "L",
      "C",
      "L",
      "B",
      "B",
      "B",
      "L",
      "B",
      "L",
    ];
    btmPlayerMoveStatus = allBlockedStatus; // Bottom player is not allowed to play again
    checkMoveStatuses(topPlayerMoveStatus, board.topPlayer);
    checkMoveStatuses(btmPlayerMoveStatus, board.bottomPlayer);

    // MOVE 10 - Top Player (Hole 12 Clockwise)
    // Important: Should not capture on previous moves.
    move = new Move(topPlayerHoles.getHoleWithID(12), MoveDirection.Clockwise);
    board.executeMove(move);
    // Bottom row configuration should remain the same
    checkSeedConfiguration(btmPlayerSeedConfig, board.bottomPlayer);

    // MOVE 11 - Bottom Player (Hole 15 Clockwise)
    move = new Move(
      bottomPlayerHoles.getHoleWithID(15),
      MoveDirection.Clockwise
    );
    board.executeMove(move);

    // MOVE 12 - Top Player (Hole 7 Anti-Clockwise)
    move = new Move(
      topPlayerHoles.getHoleWithID(7),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);

    // MOVE 13 - Bottom Player (Hole 11 Anti-Clockwise)
    // Important: Should not capture on previous moves.
    move = new Move(
      bottomPlayerHoles.getHoleWithID(11),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);

    // MOVE 14 - Top Player (Hole 13 Anti-Clockwise)
    // Important: Should not capture on previous moves.
    move = new Move(
      topPlayerHoles.getHoleWithID(13),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);

    // MOVE 15 - Bottom Player (Hole 8 Anti-Clockwise)
    // Important: Should not capture on previous moves.
    move = new Move(
      bottomPlayerHoles.getHoleWithID(8),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);

    // MOVE 16 - Top Player (Hole 8 Anti-Clockwise)
    // Important: Should not capture on previous moves.
    move = new Move(
      topPlayerHoles.getHoleWithID(12),
      MoveDirection.AntiClockwise
    );
    board.executeMove(move);

    // Bottom player looses the game
    expect(board.isGameOver()).toBe(true);
    expect(board.getWinningPlayer()).toBe(board.topPlayer);

    // Check score
    const result: Map<PlayerSide, number> = board.getScore();
    expect(result.get(PlayerSide.Top)).toBe(59);
    expect(result.get(PlayerSide.Bottom)).toBe(5);
  });

  describe("#loadState", () => {
    test("should load seed arrangement state correctly", () => {
      const topPlayerSeedConfig = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ];
      const btmPlayerSeedConfig = [
        1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 5, 6, 6, 7, 7,
      ];
      const board = Board.loadState(
        topPlayerSeedConfig,
        btmPlayerSeedConfig,
        null
      );
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
