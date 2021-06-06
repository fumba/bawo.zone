import Hole from "./Hole";
import Player from "./Player";
import PlayerSide from "./PlayerSide";
import Rules from "./Rules";
import MtajiModeRules from "./MtajiModeRules";
import PlayerBoardHoles from "./PlayerBoardHoles";
import AppConstants from "./AppConstants";

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
class Board {
  public readonly bottomPlayer: Player;
  public readonly topPlayer: Player;
  private readonly rules: Rules;

  constructor(rules?: Rules) {
    this.bottomPlayer = new Player(PlayerSide.Bottom);
    this.topPlayer = new Player(PlayerSide.Top);
    if (!rules) {
      this.rules = new MtajiModeRules();
    }
    this.rules.validate();

    // initialise player board holes
    [this.topPlayer, this.bottomPlayer].forEach((player) => {
      const playerInitSeedConfig: Array<number> = this.rules
        .initialSeedForPlayerRows()
        .get(player.side);
      const playerBoardHoles: PlayerBoardHoles = new PlayerBoardHoles(player);
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        playerBoardHoles.insertAtEnd(playerInitSeedConfig[index]);
      }
    });
  }
  /**
   * Extract the opposing enemy hole from the players front row.
   * This is hole from which the current player will be capturing seeds from.
   *
   * @param hole Hole from which the opposing enemy hole is to be retrieved from.
   * @return Opposing enemy hole.
   */
  public adjacentOpponentHole(hole: Hole): Hole {
    if (hole.isInFrontRow()) {
      const oppossingId: number = 15 - hole.id;
      const opponentPlayer: Player = this.getOpponentPlayer(hole.player);
      return opponentPlayer.boardHoles.getHoleWithID(oppossingId);
    }
    throw new Error(
      `Attempted to retrieve adjacent opponent hole from a hole that is not in the front row | input: ${hole.id}`
    );
  }

  /**
   * Retrieves the opponent player for the current player.
   *
   * @param player Player whose opponent is to be determined.
   * @return
   */
  private getOpponentPlayer(player: Player): Player {
    return player.isOnTopSide() ? this.bottomPlayer : this.topPlayer;
  }
}
export default Board;
