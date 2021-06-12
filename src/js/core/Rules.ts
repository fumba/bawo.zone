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

import Move from "./Move";
import PlayerSide from "./PlayerSide";

abstract class Rules {
  /**
   * Specifies if this particular game rule configurations allows for "nyumba".
   *
   * @returns true if the game has "nyumba".
   */
  abstract hasHomeHole(): boolean;

  /**
   * Specify the placement for the seeds on the board.
   *
   * @returns A dictionary with a PlayerSide and its corresponding hole
   *         configuration.
   */
  abstract initialSeedForPlayerRows(): Map<PlayerSide, Array<number>>;

  /**
   * Check if the move made by the player is valid.
   *
   * @param move  The move to be validated.
   * @returns true if the move is valid.
   */
  abstract isValidMove(move: Move): boolean;

  /**
   * Computes the starting hole ID after a capture is made.
   *
   * @param move  The move to be be executed.
   * @returns move which the player should take next. The returned move should
   *         always be a continuing move.
   */
  abstract nextContinuingMoveAfterCapture(move: Move): Move;

  public validate(): boolean {
    const gamePlayers = Array.from(this.initialSeedForPlayerRows().keys());
    if (this.initialSeedForPlayerRows() == null) {
      throw new Error("Seed Placement cannot be null.");
    } else if (!gamePlayers.includes(PlayerSide.Top)) {
      throw new Error("Top Player initial seed configuration is missing.");
    } else if (!gamePlayers.includes(PlayerSide.Bottom)) {
      throw new Error("Bottom Player initial seed configuration is missing.");
    } else if (gamePlayers.length > 2) {
      throw new Error(
        "Only 2 arrangement configurations are required. Supplied: " +
          gamePlayers.length
      );
    }
    return true;
  }
}

export default Rules;
