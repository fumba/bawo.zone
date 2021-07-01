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
import Board from "./Board";
import PlayerUI from "../ui_entities/PlayerUI";
import { isEmpty } from "lodash";
/**
 * <p>
 * {@link Player} represents a bawo game player
 * </p>
 */
class Player {
  //player can take up either TOP or BOTTOM side of the board
  public side: PlayerSide;

  //number of seeds that the player is holding
  public numSeedsInHand: number;

  // keeps track if the player captured on the previous move
  public capturedOnPrevMove: boolean;

  // all the board holes belonging to player
  public boardHoles: PlayerBoardHoles;

  // ui player
  public ui: PlayerUI;

  /**
   * constructor
   *
   * @param {PlayerSide} side the side on which the player is on the board
   * @param {Board} board the board on which the player is
   */
  constructor(side: PlayerSide, board?: Board) {
    this.side = side;
    this.numSeedsInHand = 0;
    this.capturedOnPrevMove = false;
    if (!isEmpty(board)) {
      if (board.isInGraphicsMode()) {
        this.ui = board.me.pool.pull(AppConstants.PLAYER_UI, this);
      }
    }
  }

  /**
   * Checks to see if the current player is positioned on the top side of the
   * board.
   *
   * @returns {boolean} true if the player is on the top side.
   */
  public isOnTopSide(): boolean {
    return this.side == PlayerSide.Top;
  }

  public toString(): string {
    return `PLAYER[ side: ${this.side}, hand-seeds: ${this.numSeedsInHand}, captured-on-prev-move?: ${this.capturedOnPrevMove}]`;
  }
}

export default Player;
