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

import Rules from "./Rules";
import PlayerSide from "./PlayerSide";
import AppConstants from "./AppConstants";
import Move from "./Move";
import MoveDirection from "./MoveDirection";
import Hole from "./Hole";

class MtajiModeRules extends Rules {
  constructor() {
    super();
  }

  /**
   * Mtaji mode does not use home-hole
   * @returns false - home is not used in mtaji mode
   */
  public hasHomeHole(): boolean {
    return false;
  }

  /**
   *
   * Specify seed placement using an array with indices 0-15 representing player
   * hold IDs.
   * In this version of the game, 2 seeds are placed in each hole.
   *
   * @returns  mtaji initial seed arrangement - 2 seeds in each hole
   */
  public initialSeedForPlayerRows(): Map<PlayerSide, Array<number>> {
    const boardSeedInitialArrangement: Array<number> = new Array(
      AppConstants.NUM_PLAYER_HOLES
    );
    for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
      boardSeedInitialArrangement[index] = 2;
    }
    const map: Map<PlayerSide, Array<number>> = new Map();
    map.set(PlayerSide.Top, boardSeedInitialArrangement);
    map.set(PlayerSide.Bottom, boardSeedInitialArrangement);
    return map;
  }

  /**
   * Check if the player is attempting to make a valid move.
   */
  public isValidMove(move: Move): boolean {
    // Rule 1: Continuing moves since they are determined by game rules
    if (move.isContinuing()) {
      return true;
    }

    // Rule 2: Check if this move results in a capture
    if (move.isValidCapture()) {
      return true;
    }

    // Rules 3 and 4 only apply if the move plants seed token in any front row holes

    // Rule 3: If there are no capture moves, any front row holes with
    // seed tokens are valid moves.
    // Rule 4: If there are no valid front row non-capture moves, use the back row holes.
    if (move.isValidNonCapture()) {
      return true;
    }
    return false;
  }

  public computeStartingHoleAndDirAfterCapture(move: Move): Move {
    // Force Switch direction if steal is made on last 2 holes on the row
    // Maintain move direction for other steals
    if (move.hole.player.isOnTopSide()) {
      return this.updateMoveDirectionAndHole(move, [14, 15], [8, 9], 8, 15);
    } else {
      return this.updateMoveDirectionAndHole(move, [6, 7], [0, 1], 0, 7);
    }
  }

  private updateMoveDirectionAndHole(
    capturingMove: Move,
    clockwiseReverseHoleIDs: Array<number>,
    anticlockwiseReverseHoleIDs: Array<number>,
    clockwiseResetHoleId: number,
    clockwiseReversedResetHoleId: number
  ): Move {
    const prevContinuedMovesCount: number =
      capturingMove.prevContinuedMovesCount + 1;
    let direction = capturingMove.direction;
    let hole: Hole;
    const board = capturingMove.board;

    const playerHoles = capturingMove.hole.player.boardHoles;
    if (direction == MoveDirection.Clockwise) {
      if (clockwiseReverseHoleIDs.includes(capturingMove.hole.id)) {
        // reverse directions and start on opposite side
        direction = MoveDirection.AntiClockwise;
        hole = playerHoles.getHoleWithID(clockwiseReversedResetHoleId);
      } else {
        hole = playerHoles.getHoleWithID(clockwiseResetHoleId);
      }
    } else {
      if (anticlockwiseReverseHoleIDs.includes(capturingMove.hole.id)) {
        // reverse directions and start on opposite side
        direction = MoveDirection.Clockwise;
        hole = playerHoles.getHoleWithID(clockwiseResetHoleId);
      } else {
        hole = playerHoles.getHoleWithID(clockwiseReversedResetHoleId);
      }
    }
    return new Move(board, hole, direction, prevContinuedMovesCount);
  }
}

export default MtajiModeRules;
