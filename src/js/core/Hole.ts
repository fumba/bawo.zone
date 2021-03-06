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

import AppConstants from "./AppConstants";
import Board from "./Board";
import MoveDirection from "./MoveDirection";
import Player from "./Player";
import Utility from "../Utility";

import { isEmpty } from "lodash";
import HoleUI from "../ui_entities/HoleUI";
import SeedUI from "../ui_entities/SeedUI";
import SeedGroupUI from "../ui_entities/SeedGroupUI";
import Move from "./Move";
import UiTaskActions from "./UiTaskActions";

class Hole {
  // Number of seeds in hole
  public numSeeds: number;
  // The next hole
  public nextHole: Hole;
  // Previous hole
  public prevHole: Hole;
  // Hole ID (based on PlayerBoardHoles)
  public readonly id: number;
  // Unique hole ID (with player side)
  public readonly UID: string;
  // The player who is assigned this hole
  public readonly player: Player;
  // Whether the player is allowed to make moves on this hole.
  public moveStatus: MoveDirection;
  // the board on which the hole is placed
  public board: Board;
  // Hole UI corresponding to this hole
  public ui: HoleUI;
  // Seed Group UI corresponding to this hole
  public seedGroupUI: SeedGroupUI;

  /**
   * Constructor
   *
   * @param {Player} player   The player to whom this hole is being assigned to
   * @param {Board} board The board on which the hole is placed
   * @param {number} id      Unique hole ID (Ranging 0-16) -1 is used for the dummy
   *                 pointer to the first hole.
   * @param {number} numSeeds Number of seeds to be initially added to the hole.
   * @param {Hole} prevHole The hole that is before this hole.
   * @param {Hole} nextHole The hole that comes up next in clockwise fashion
   */
  constructor(
    player: Player,
    board: Board,
    id: number,
    numSeeds: number,
    prevHole: Hole,
    nextHole: Hole
  ) {
    this.player = player;
    this.id = id;
    if (!isEmpty(this.player)) {
      this.UID = `[${Utility.padZero(this.id)}-${this.player.side}]`;
    }
    this.numSeeds = numSeeds;
    this.nextHole = nextHole;
    this.prevHole = prevHole;
    this.board = board;

    // initialize move status as unauthorized
    this.moveStatus = MoveDirection.UnAuthorized;
  }

  /**
   * Check if this hole is in the front row (Front rows are allowed to capture
   * seeds from enemy side).
   *
   * @returns {boolean} true is the hole is in the front row for the owning player.
   */
  public isInFrontRow(): boolean {
    if (this.player.isOnTopSide()) {
      return this.id >= 8;
    } else {
      return this.id < 8;
    }
  }

  /**
   *  Checks to see if the hole contains any seeds
   *
   * @returns {boolean} true if seeds are present
   */
  public isEmpty(): boolean {
    return this.numSeeds == 0;
  }

  public toString(): string {
    return `[${Utility.padZero(this.id)}(${Utility.padZero(this.numSeeds)})-${
      this.moveStatus
    }]`;
  }

  /**
   * Moves all seeds from the hole into players hand - clearing it to a count of 0.
   *
   * @returns {number} The number of seeds that were moved from hole into players hand.
   */
  public transferAllSeedsToCurrPlayer(): number {
    if (this.numSeeds == 0) {
      return 0;
    }
    const numSeedsTemp = this.numSeeds;
    this.numSeeds = 0;

    if (this.board.isInGraphicsMode()) {
      const task = {
        name: UiTaskActions.GRAB_ALL_SEEDS_FROM_HOLE,
        hole: this,
        isCapture: this.player.side != this.board.getCurrentPlayer().side,
      };
      this.board.uiTaskQueue.enqueue(task);
    }
    if (numSeedsTemp > 0) {
      this.board.getCurrentPlayer().numSeedsInHand += numSeedsTemp;
    }
    return numSeedsTemp;
  }

  /**
   * Removes seeds from players hand
   *
   * @param {number} numSeeds Number of seeds to be removed from players hand
   * @returns {number} Number of seeds removed from the player hand
   */
  public transferSeedsFromCurrPlayer(numSeeds: number): number {
    this.validateNumSeeds(numSeeds);
    this.validateFinalSeedCount(-numSeeds); //minus because we are removing seeds
    this.board.getCurrentPlayer().numSeedsInHand -= numSeeds;

    this.numSeeds += numSeeds;
    if (this.board.isInGraphicsMode()) {
      //add seeds to hole ui
      for (let i = 0; i < numSeeds; i++) {
        const task = {
          name: UiTaskActions.SOW_SEED_INTO_HOLE,
          seedId: SeedUI.seedGroupId(this.UID),
          seedGroupUI: this.seedGroupUI,
        };
        this.board.uiTaskQueue.enqueue(task);
      }
    }
    return numSeeds;
  }

  /**
   * Checks if the number of seeds to be added or removed from players hand is valid
   *
   * @param {number} numSeeds Number of seeds to be added or removed from players hand
   */
  private validateNumSeeds(numSeeds: number): void {
    let message: string = null;
    if (numSeeds < 0) {
      message =
        "Attempted to add or remove negative number seeds | input : " +
        numSeeds;
    } else if (numSeeds == 0) {
      message = "Attempted to add or remove no seeds";
    }
    if (message) {
      throw new Error(message);
    }
  }

  /**
   * Checks if the the total number of seeds in players hand is valid
   *
   * @param {number} numSeeds Number of seeds in players hand after adding or removing
   */
  private validateFinalSeedCount(numSeeds: number): void {
    let message: string = null;
    if (this.board.getCurrentPlayer().numSeedsInHand + numSeeds < 0) {
      message =
        "Total number of seeds after operation is negative | input: " +
        numSeeds;
    }
    if (message) {
      throw new Error(message);
    }
  }
  /**
   * Gets the moves that are available for the current player
   *
   * @returns {Array<Move>} moves that can be played
   */
  public availableMovesForCurrentPlayer(): Array<Move> {
    const moves: Array<Move> = [];
    if (
      this.moveStatus == MoveDirection.Clockwise ||
      this.moveStatus == MoveDirection.AntiClockwise
    ) {
      moves.push(new Move(this, this.moveStatus));
    } else if (this.moveStatus == MoveDirection.Both) {
      moves.push(new Move(this, MoveDirection.Clockwise));
      moves.push(new Move(this, MoveDirection.AntiClockwise));
    }
    return moves;
  }

  /**
   * Calculates the move direction that corresponds to a users drag and drop action.
   * Seeds are dragged from an origin hole into the target hole. The direction is only returned if
   * the target hole is adjacent to the origin.
   *
   * @param {Hole} targetHole the hole into which the seeds are being dragged into
   * @returns {MoveDirection} the direction that corresponds to the users drag and drop action.
   */
  public adjacencyDirection(targetHole: Hole): MoveDirection {
    //retrieved valid move directions for the hole
    const validDirections = this.availableMovesForCurrentPlayer().map(
      (move) => move.direction
    );
    if (
      validDirections.includes(MoveDirection.Clockwise) &&
      this.nextHole.UID == targetHole.UID
    ) {
      return MoveDirection.Clockwise;
    } else if (
      validDirections.includes(MoveDirection.AntiClockwise) &&
      this.prevHole.UID == targetHole.UID
    ) {
      return MoveDirection.AntiClockwise;
    }
    return null;
  }

  /**
   * Renders the hole and its contents (seeds)
   */
  public renderUI(): void {
    //render hole
    const holeUI = this.board.me.pool.pull(AppConstants.HOLE_UI, this);
    this.board.ui.addChild(holeUI);
    this.ui = holeUI;

    // invisible draggable collection that contains seeds
    const seedGroup = this.board.me.pool.pull(AppConstants.SEED_GROUP_UI, this);
    this.seedGroupUI = seedGroup;
    this.board.ui.addChild(seedGroup);

    for (let i = 0; i < this.numSeeds; i++) {
      // render seeds that belong to hole
      const seedUI = this.board.me.pool.pull(
        AppConstants.SEED_UI,
        this.seedGroupUI,
        this.UID
      );
      this.board.ui.addChild(seedUI);
    }
  }
}

export default Hole;
