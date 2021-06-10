import Hole from "./Hole";
import Player from "./Player";
import PlayerSide from "./PlayerSide";
import Rules from "./Rules";
import MtajiModeRules from "./MtajiModeRules";
import PlayerBoardHoles from "./PlayerBoardHoles";
import AppConstants from "./AppConstants";
import Logger from "../../helpers/Logger";
import Move from "./Move";
import MoveDirection from "./MoveDirection";

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
  private currentPlayer: Player;
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

    //set current player
    this.currentPlayer = this.topPlayer;
    this.updateMovesStatus();
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
   * Update the move status for all the holes on the board.
   *
   * Move Status can be one of the following:
   *
   * CLOCKWISE
   *
   * ANTI_CLOCKWISE
   *
   * BOTH - Both clockwise and anti-clockwise moves are allowed.
   *
   * LOCKED - A valid move cannot be made from the hole.
   *
   * UNAUTHORISED - The hole does not belong to the current player.
   */
  private updateMovesStatus(): void {
    for (const hole of this.topPlayer.boardHoles) {
      this.updateMoveStatusForHole(hole);
    }
    for (const hole of this.bottomPlayer.boardHoles) {
      this.updateMoveStatusForHole(hole);
    }
  }

  /**
   * Updates the move status for the specified hole.
   *
   * @param hole The Hole on will be performed on.
   */
  private updateMoveStatusForHole(hole: Hole): void {
    // Update status only if the current player is authorized to make a move
    // on the hole.
    if (
      hole.player == this.currentPlayer &&
      this.currentPlayer.numSeedsInHand == 0
    ) {
      const clockwiseMove: Move = new Move(this, hole, MoveDirection.Clockwise);
      const antiClockwiseMove: Move = new Move(
        this,
        hole,
        MoveDirection.AntiClockwise
      );
      const isValidClockwiseMove: boolean = this.isValidMove(clockwiseMove);
      const isValidAntiClockwiseMove: boolean =
        this.isValidMove(antiClockwiseMove);
      if (isValidClockwiseMove && isValidAntiClockwiseMove) {
        hole.moveStatus = MoveDirection.Both;
      } else if (isValidClockwiseMove) {
        hole.moveStatus = MoveDirection.Clockwise;
      } else if (isValidAntiClockwiseMove) {
        hole.moveStatus = MoveDirection.AntiClockwise;
      } else {
        hole.moveStatus = MoveDirection.Locked;
      }
    } else {
      // holes that do not belong to the current player are set as
      // unauthorized.
      hole.moveStatus = MoveDirection.UnAuthorised;
    }
  }

  /**
   * Check if a move valid. GameRules implementation is used to make this
   * decision.
   *
   * @param move The move whose validity is to be checked.
   * @return boolean {@code true} if the move is valid.
   */
  public isValidMove(move: Move): boolean {
    //check move integrity
    if (move == null) {
      throw new Error("Move is null.");
    }
    // Check if the current player is allowed to make move.
    if (this.currentPlayer == null) {
      throw new Error("Current player is not specified.");
    }
    if (this.currentPlayer != move.hole.player) {
      throw new Error(
        "Player " +
          this.currentPlayer +
          " is not allowed to make a move on hole " +
          move.hole.toString()
      );
    }
    if (move.hole == null) {
      throw new Error("Move is required to have a starting hole specified.");
    }
    if (move.direction == null) {
      throw new Error("Move is required to have its direction specified.");
    }

    return this.rules.isValidMove(move);
  }

  public switchPlayers(): void {
    if (
      this.topPlayer.numSeedsInHand == 0 &&
      this.bottomPlayer.numSeedsInHand == 0
    ) {
      this.currentPlayer = this.getOpponentPlayer(this.currentPlayer);
    } else {
      throw new Error(
        "Cannot assign players while player(s) has(ve) seed(s) in hand: \n" +
          this.topPlayer +
          "\n" +
          this.bottomPlayer
      );
    }
    this.updateMovesStatus();
    Logger.info(
      "Players Switched. Current player info: \n" +
        this.currentPlayer.toString(),
      Board.name
    );
  }

  //TODO
  public static loadState(
    topPlayerSeedArrangement: Array<number>,
    btmPlayerSeedArrangement: Array<number>
  ): Board {
    const board: Board = new Board();
    //update hole seed counts for top player
    if (topPlayerSeedArrangement) {
      //TODO validate length - 16
      Logger.info(
        `Updating seed configuration for bottom player to ${topPlayerSeedArrangement}`,
        this.name
      );
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        board.topPlayer.boardHoles.getHoleWithID(id).numSeeds =
          topPlayerSeedArrangement[id];
      }
    }
    //update hole seed counts for bottom player
    if (btmPlayerSeedArrangement) {
      //TODO validate length - 16
      Logger.info(
        `Updating seed configuration for bottom player to ${btmPlayerSeedArrangement}`,
        this.name
      );
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        board.bottomPlayer.boardHoles.getHoleWithID(id).numSeeds =
          btmPlayerSeedArrangement[id];
      }
    }
    return board;
  }

  public toString(): string {
    this.updateMovesStatus();
    let buffer = "\n".concat(this.topPlayer.boardHoles.toString());
    buffer = buffer.concat(this.bottomPlayer.boardHoles.toString());
    return buffer.replace(/\n$/, ""); //remove newline at the end
  }

  public runSimulation(): void {
    Logger.info(`initial board state : ${this}`, Board.name);
    this.switchPlayers();
    Logger.info(`state after switching players : ${this}`, Board.name);
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
