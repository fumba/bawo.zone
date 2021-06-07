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

import MoveDirection from "./MoveDirection";
import Player from "./Player";

class Hole {
  // Number of seeds in hole
  public numSeeds: number;
  // The next hole
  public nextHole: Hole;
  // Previous hole
  public prevHole: Hole;
  // Holes unique ID
  public readonly id: number;
  // The player who is assigned this hole
  public readonly player: Player;
  // Whether the player is allowed to make moves on this hole.
  public readonly moveStatus: MoveDirection;

  /**
   * Constructor
   *
   * @param player   The player to whom this hole is being assigned to
   * @param id       Unique hole ID (Ranging 0-16) -1 is used for the dummy
   *                 pointer to the first hole.
   * @param numSeeds Number of seeds to be initially added to the hole.
   * @param prevHole The hole that is before this hole.
   * @param nextHole The hole that comes up next in clockwise fashion
   */
  constructor(
    player: Player,
    id: number,
    numSeeds: number,
    prevHole: Hole,
    nextHole: Hole
  ) {
    this.player = player;
    this.id = id;
    this.numSeeds = numSeeds;
    this.nextHole = nextHole;
    this.prevHole = prevHole;

    // initialize move status as unauthorized
    this.moveStatus = MoveDirection.UnAuthorised;
  }

  /**
   * Check if this hole is in the front row (Front rows are allowed to capture
   * seeds from enemy side).
   *
   * @return true is the hole is in the front row for the owning player.
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
   * @returns true if seeds are present
   */
  public isEmpty(): boolean {
    return this.numSeeds == 0;
  }

  public toString(): string {
    return `[${this.id}(${this.numSeeds})-${this.moveStatus}]`;
  }
}

export default Hole;