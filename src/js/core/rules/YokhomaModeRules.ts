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

import Move from "../Move";
import PlayerSide from "../PlayerSide";
import Rules from "../Rules";

class YokhomaModeRules extends Rules {
  /**
   * Specifies if this particular game rule configurations allows for "nyumba".
   *
   * @returns {boolean} true if the game has "nyumba".
   */
  public hasHomeHole(): boolean {
    return true;
  }

  /**
   * Specify the placement for the seeds on the board.
   *
   * @returns {Map} A dictionary with a PlayerSide and its corresponding hole
   *         configuration.
   */
  public initialSeedForPlayerRows(): Map<PlayerSide, Array<number>> {
    const map: Map<PlayerSide, Array<number>> = new Map();
    map.set(
      PlayerSide.Top,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 2, 2, 0, 18]
    );
    map.set(
      PlayerSide.Bottom,
      [0, 0, 0, 0, 10, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18]
    );
    return map;
  }

  /**
   * Check if the move made by the player is valid.
   *
   * @param {Move} move  The move to be validated.
   * @returns {boolean} true if the move is valid.
   */
  public isValidMove(move: Move): boolean {
    return move && false;
  }

  /**
   * Computes the starting hole ID after a capture is made.
   *
   * @param {Move} move  The move to be be executed.
   * @returns {Move} move which the player should take next. The returned move should
   *         always be a continuing move.
   */
  public nextContinuingMoveAfterCapture(move: Move): Move {
    //TODO : remove this after implementation
    /* istanbul ignore next */
    return move && null;
  }
}

export default YokhomaModeRules;
