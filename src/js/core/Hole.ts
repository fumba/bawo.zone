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
import Utility from "../../helpers/Utility";

import { isEmpty } from "lodash";
import HoleUI from "../entities/HoleUI";
import SeedUI from "../entities/SeedUI";
import SeedGroupUI from "../entities/SeedGroupUI";

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
  public readonly board: Board;
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
    this.moveStatus = MoveDirection.UnAuthorised;

    if (
      !isEmpty(this.board) &&
      this.board.isGraphicsMode() &&
      this.id != AppConstants.DUMMY_HOLE_ID
    ) {
      this.renderHoleAndSeeds();
    }
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
  public moveSeedsIntoCurrentPlayerHand(): number {
    const numSeedsTemp = this.numSeeds;
    this.numSeeds = 0;

    if (this.board.isGraphicsMode()) {
      //remove all ui seeds from hole
      this.seedGroupUI.getAllUISeeds().forEach((seedUI: SeedUI) => {
        this.board.getCurrentPlayer().ui.addSeed(seedUI);
        seedUI.group = null;
        seedUI.id = null;
      });
    }
    if (numSeedsTemp > 0) {
      this.board.getCurrentPlayer().numSeedsInHand += numSeedsTemp;
    }
    return numSeedsTemp;
  }

  /**
   * Renders the hole and its contents (seeds)
   */
  private renderHoleAndSeeds(): void {
    //render hole
    const holeUI = this.board.me.pool.pull(AppConstants.HOLE_UI, this);
    this.board.me.game.world.addChild(holeUI);
    this.ui = holeUI;

    // invisible draggable collection that contains seeds
    const seedGroup = this.board.me.pool.pull(AppConstants.SEED_GROUP_UI, this);
    this.seedGroupUI = seedGroup;
    this.board.me.game.world.addChild(seedGroup);

    for (let i = 0; i < this.numSeeds; i++) {
      // render seeds that belong to hole
      const seedUI = this.board.me.pool.pull(
        AppConstants.SEED_UI,
        this.seedGroupUI,
        this.UID
      );
      this.board.me.game.world.addChild(seedUI);
    }
  }
}

export default Hole;
