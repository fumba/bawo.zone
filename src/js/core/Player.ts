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

import PlayerSide from "./PlayerSide";
import AppConstants from "./AppConstants";
import PlayerBoardHoles from "./PlayerBoardHoles";
/**
 * <p>
 * {@link Player} represents a bawo game player
 * </p>
 **/
class Player {
  //player can take up either TOP or BOTTOM side of the board
  public side: PlayerSide;

  //number of seeds that the player is holding
  public numSeedsInHand: number;

  // keeps track if the player captured on the previous move
  public capturedOnPrevMove: boolean;

  // all the board holes belonging to player
  public boardHoles: PlayerBoardHoles;

  /**
   * constructor
   * @param side the side on which the player is on the board
   */
  constructor(side: PlayerSide) {
    this.side = side;
    this.numSeedsInHand = 0;
    this.capturedOnPrevMove = false;
  }

  /**
   * Adds seeds to players hand
   * @param numSeeds Number of seeds to be added to players hand
   */
  public addSeeds(numSeeds: number): void {
    this.validateNumSeeds(numSeeds);
    this.validateFinalSeedCount(numSeeds);
    this.numSeedsInHand += numSeeds;
  }

  /**
   * Removes seeds from players hand
   * @param numSeeds Number of seeds to be removed from players hand
   */
  public removeSeeds(numSeeds: number): void {
    this.validateNumSeeds(numSeeds);
    this.validateFinalSeedCount(-numSeeds); //minus because we are removing seeds
    this.numSeedsInHand -= numSeeds;
  }

  /**
   * Checks to see if the current player is positioned on the top side of the
   * board.
   *
   * @return true if the player is on the top side.
   */
  public isOnTopSide(): boolean {
    return this.side == PlayerSide.Top;
  }

  public toString(): string {
    return `PLAYER[ side: ${this.side}, hand seeds: ${this.numSeedsInHand}, captured on prev move?: ${this.capturedOnPrevMove}]`;
  }

  /**
   * Checks if the number of seeds to be added or removed from players hand is valid
   * @param numSeeds Number of seeds to be added or removed from players hand
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
   * @param numSeeds Number of seeds in players hand after adding or removing
   */
  private validateFinalSeedCount(numSeeds: number): void {
    let message: string = null;
    if (this.numSeedsInHand + numSeeds < 0) {
      message =
        "Total number of seeds after operation is negative | input: " +
        numSeeds;
    } else if (this.numSeedsInHand + numSeeds > AppConstants.MAX_SEED_COUNT) {
      message =
        "Total number of seeds after operation is greater than 64 | input: " +
        numSeeds;
    }
    if (message) {
      throw new Error(message);
    }
  }
}

export default Player;
