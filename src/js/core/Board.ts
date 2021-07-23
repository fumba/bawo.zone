import Hole from "./Hole";
import Player from "./Player";
import PlayerSide from "./PlayerSide";
import Rules from "./Rules";
import MtajiModeRules from "./rules/MtajiModeRules";
import PlayerBoardHoles from "./PlayerBoardHoles";
import AppConstants from "./AppConstants";
import Move from "./Move";
import MoveDirection from "./MoveDirection";
import Me from "../me";
import { isEmpty } from "lodash";
import SeedUI from "../ui_entities/SeedUI";
import Utility from "../Utility";
import { Queue } from "queue-typescript";
import PlayerUI from "../ui_entities/PlayerUI";
import UiHelper from "../ui_entities/UiHelper";
import BoardUiState from "./BoardUiState";

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

/**
 *  The <tt>GameBoard</tt> class represents the bawo/bao  game board.
 *  <p>
 *
 *  The board is represented using 2 circular doubly linked lists each assigned to a player. Each list represents 2 rows with
 *  hole Ids assigned as shown below;
 *
 *
 *    TOP PLAYER sitting position (facing down)
 *    00	01	02	03	04	05	06	07
 *    15	14	13	12	11	10	09	08
 *
 *    00	01	02	03	04	05	06	07
 *    15	14	13	12	11	10	09	08
 *    BOTTOM PLAYER sitting position (facing up)
 *
 *    32 (optional hole - depends of game version)
 *
 *  Rules for Placement of seeds are specified in classes implementing  the interface <tt>GameRules</tt>.
 *  <p>
 *
 *  @author  <a href="http://fumba.me">Fumba Chibaka</a>
 */
class Board {
  private currentPlayer: Player;
  public readonly bottomPlayer: Player;
  public readonly topPlayer: Player;
  private readonly rules: Rules;
  public readonly me: typeof Me;
  public uiTaskQueue: Queue<Record<string, unknown>> = new Queue();

  /**
   * The game play is in a continuous loop if the player continues to play beyond a
   * threshold amount of moves.
   * The game will end and the player who got themselves into an infinite loop will lose.
   */
  private isInContinuousLoopStatus = false;

  /**
   * @param {any} me melonjs instance
   * @param {Rules} rules game rules - default is MtajiModeRules
   */
  constructor(me?: typeof Me, rules = new MtajiModeRules()) {
    this.me = me;
    this.bottomPlayer = new Player(PlayerSide.Bottom, this);
    this.topPlayer = new Player(PlayerSide.Top, this);
    this.rules = rules;
    this.rules.validate();

    // initialize player board holes
    [this.topPlayer, this.bottomPlayer].forEach((player) => {
      const playerInitSeedConfig: Array<number> = this.rules
        .initialSeedForPlayerRows()
        .get(player.side);
      const playerBoardHoles: PlayerBoardHoles = new PlayerBoardHoles(
        player,
        this
      );
      for (let index = 0; index < AppConstants.NUM_PLAYER_HOLES; index++) {
        playerBoardHoles.insertAtEnd(playerInitSeedConfig[index]);
      }
      if (this.rules.hasHomeHole()) {
        player.boardHoles.nyumba.numSeeds = playerInitSeedConfig[16];
      }
    });

    //set current players
    this.currentPlayer = this.topPlayer;
    this.updateMovesStatus();

    if (this.isInGraphicsMode()) {
      //render holes on board
      [this.topPlayer, this.bottomPlayer].forEach((player) => {
        for (const hole of player.boardHoles) {
          hole.renderUI();
        }
        if (this.rules.hasHomeHole()) {
          player.boardHoles.nyumba.renderUI();
        }
      });
    }

    this.validateUiState();
  }

  /**
   * Extract the opposing enemy hole from the players front row.
   * This is hole from which the current player will be capturing seeds from.
   *
   * @param {Hole} hole Hole from which the opposing enemy hole is to be retrieved from.
   * @returns {Hole} Opposing enemy hole.
   */
  public adjacentOpponentHole(hole: Hole): Hole {
    if (hole.isInFrontRow()) {
      const opposingId: number = 15 - hole.id;
      const opponentPlayer: Player = this.getOpponentPlayer(hole.player);
      return opponentPlayer.boardHoles.getHoleWithID(opposingId);
    }
    throw new Error(
      `Attempted to retrieve adjacent opponent hole from a hole that is not in the front row | input: ${hole.id}`
    );
  }

  /**
   *  Retrieves the current player.
   *
   * @returns {Player} current player
   */
  public getCurrentPlayer(): Player {
    return this.currentPlayer;
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
   * UNAUTHORIZED - The hole does not belong to the current player.
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
   * @param {Hole} hole The Hole on will be performed on.
   */
  private updateMoveStatusForHole(hole: Hole): void {
    // Update status only if the current player is authorized to make a move
    // on the hole.
    if (
      hole.player == this.currentPlayer &&
      this.currentPlayer.numSeedsInHand == 0
    ) {
      const clockwiseMove: Move = new Move(hole, MoveDirection.Clockwise);
      const antiClockwiseMove: Move = new Move(
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
      hole.moveStatus = MoveDirection.UnAuthorized;
    }
  }

  /**
   * Check if a move valid. GameRules implementation is used to make this
   * decision.
   *
   * @param {Move} move The move whose validity is to be checked.
   * @returns {boolean} {@code true} if the move is valid.
   */
  public isValidMove(move: Move): boolean {
    //check move integrity
    if (move == null) {
      throw new Error("Move is null.");
    }
    if (move.hole == null) {
      throw new Error("Move is required to have a starting hole specified.");
    }
    if (move.direction == null) {
      throw new Error("Move is required to have its direction specified.");
    }
    if (this.currentPlayer.side != move.hole.player.side) {
      throw new Error(
        "Player " +
          this.currentPlayer.toString() +
          " is not allowed to make a move on hole " +
          move.hole.toString()
      );
    }
    return this.rules.isValidMove(move);
  }

  /**
   * Switch Players.
   *
   * @throws Error when an attempt is made to switch while one of the players has seeds in hands.
   */
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
    console.info(
      "Players Switched. Current player info: \n" +
        this.currentPlayer.toString()
    );
  }

  /**
   * Clones a board
   *
   * @returns {Board} a clone of the board
   */
  public clone(): Board {
    const topPlayerSeedArrangement: Array<number> = [];
    const btmPlayerSeedArrangement: Array<number> = [];
    for (const hole of this.topPlayer.boardHoles) {
      topPlayerSeedArrangement.push(hole.numSeeds);
    }
    for (const hole of this.bottomPlayer.boardHoles) {
      btmPlayerSeedArrangement.push(hole.numSeeds);
    }
    return Board.loadState(
      topPlayerSeedArrangement,
      btmPlayerSeedArrangement,
      this.currentPlayer
    );
  }

  //TODO
  public static loadState(
    topPlayerSeedArrangement: Array<number>,
    btmPlayerSeedArrangement: Array<number>,
    currentPlayer: Player
  ): Board {
    const board: Board = new Board(null);
    if (
      currentPlayer != null &&
      board.currentPlayer.side != currentPlayer.side
    ) {
      board.switchPlayers();
    }
    //update hole seed counts for top player
    if (topPlayerSeedArrangement) {
      //TODO validate length - 16
      console.info(
        `Cloning seed configuration for TOP player to ${topPlayerSeedArrangement}`
      );
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        board.topPlayer.boardHoles.getHoleWithID(id).numSeeds =
          topPlayerSeedArrangement[id];
      }
    }
    //update hole seed counts for bottom player
    if (btmPlayerSeedArrangement) {
      //TODO validate length - 16
      console.info(
        `Cloning seed configuration for BOTTOM player to ${btmPlayerSeedArrangement}`
      );
      for (let id = 0; id < AppConstants.NUM_PLAYER_HOLES; id++) {
        board.bottomPlayer.boardHoles.getHoleWithID(id).numSeeds =
          btmPlayerSeedArrangement[id];
      }
    }
    board.updateMovesStatus();
    return board;
  }

  /**
   * Retrieves all the valid moves for a player.
   *
   * @param {Player} player The Player who is requesting the list of valid moves.
   * @returns {Array<Move>} A list of moves that are valid. These moves can be executed on the board.
   */
  public getAllAvailableValidMoves(player: Player): Array<Move> {
    this.updateMovesStatus();
    const moves: Array<Move> = [];
    for (const hole of player.boardHoles) {
      hole.availableMovesForCurrentPlayer().forEach((move) => moves.push(move));
    }
    return moves;
  }

  /**
   * Execute a move:
   *
   * The rules on how the move is to be performed are specified in the
   * implementation of the GameRules interface.
   *
   * @param {Move} move The move to be executed.
   * @returns {boolean} A boolean value representing whether or not the move was successful.
   */
  public executeMove(move: Move): boolean {
    console.info("Board#executeMove- Received move", move);
    this.validateUiState();
    if (move.hole.player.side != this.currentPlayer.side) {
      throw new Error(
        `${this.currentPlayer} is unauthorized to perform ${move.toString()}`
      );
    }
    if (move.prevContinuedMovesCount > AppConstants.INFINITE_LOOP_THRESHOLD) {
      // The player has made more than the allowed amount of moves. They
      // are now regarded to be in infinite move status. The game will end and the player who got themselves into an infinite loop will loose.

      // place all the seeds back into the start hole for the move.
      move.hole.transferSeedsFromCurrPlayer(this.currentPlayer.numSeedsInHand);

      this.isInContinuousLoopStatus = true;
      // TODO update GUI state
      return true;
    }
    if (!this.isValidMove(move)) {
      console.info(
        "Requested move is not valid.",
        move.toString(),
        move.hole.board.toString()
      );
      return false;
    }

    const numSeedsToSowPerStep = 1;
    let currentHole: Hole = move.hole; //starting hole
    let destinationHole: Hole;
    // Continuing moves already have seeds in the player hands
    // Initial moves need to get the seeds from the hole into the players hand
    if (!move.isContinuing()) {
      console.info("detected new move - transferring seeds to players hand");
      currentHole.transferAllSeedsToCurrPlayer();
    }

    console.info(`Board before seeds are moved: ${this.toString()}`);
    console.info("Current player before seeds are moved", this.currentPlayer);
    while (this.currentPlayer.numSeedsInHand > 0) {
      // Find out which hole the player should move to next
      if (this.currentPlayer.capturedOnPrevMove) {
        // if a player captured on the previous move, plant a seed in
        // the after-capture start hole before moving to other holes.
        destinationHole = currentHole;
        // reset previous capture flag
        this.currentPlayer.capturedOnPrevMove = false;
      } else {
        destinationHole = this.computeDestinationHole(
          move.direction,
          currentHole,
          numSeedsToSowPerStep
        );
      }
      // Place 1 seed in the destination hole and move on to the next
      // hole.
      destinationHole.transferSeedsFromCurrPlayer(numSeedsToSowPerStep); //TODO-GUI: remove seed from hand
      currentHole = destinationHole;

      //TODO update GUI state
      console.info("Board Status after sowing one seed: \n" + this.toString());
      console.info(
        "Current Player status  after sowing one seed",
        this.currentPlayer
      );
    }

    console.info("Current player no longer has any  left seeds in hand");
    // Get the enemy's hole id at the end of the move if destination has
    // move than 1 seed in total
    if (currentHole.numSeeds > 1) {
      let continuingMove: Move;
      // Capture enemies seeds and continue playing (re-start from side)
      // Only capture seeds if the initial move was mtaji (a capture move)
      if (move.isMtaji && this.captureAllSeedsFromEnemy(currentHole)) {
        const captureMove: Move = new Move(
          currentHole,
          move.direction,
          move.prevContinuedMovesCount
        );
        continuingMove = this.rules.nextContinuingMoveAfterCapture(captureMove);
        // All moves at this point will be able to capture seeds...
        continuingMove.isMtaji = move.isMtaji;
        return this.executeMove(continuingMove);
      } else {
        // Take all seeds in hole and continue with current player without capturing any seeds
        currentHole.transferAllSeedsToCurrPlayer();
        continuingMove = new Move(
          currentHole,
          move.direction,
          move.prevContinuedMovesCount + 1
        );
        if (move.isContinuing()) {
          // get mtaji status from parent
          continuingMove.isMtaji = move.isMtaji;
        } else {
          // this is an initial move that didn't capture...
          // Do not allow any other moves to capture at this point...
          continuingMove.isMtaji = false;
        }
        return this.executeMove(continuingMove);
      }
    }

    // Switch player sides once a move is executed successfully.
    this.switchPlayers();
    console.info("Board Status After Move : \n" + this.toString());
    console.info("Move is Completed!");
    //TODO Update GUI state

    this.validateUiState();
    return true;
  }

  /**
   * Validates the state of UI entities:
   *
   * 1. There should always be 64 seeds in play (before move and after move)
   */
  public validateUiState(): void {
    if (this.isInGraphicsMode()) {
      const seedUiCount = this.me.game.world.getChildByType(SeedUI).length;
      if (seedUiCount != AppConstants.MAX_SEED_COUNT) {
        throw new Error(
          `UI State has ${seedUiCount} seeds present. There should always be 64 seeds in play`
        );
      }
      const playerUiCount = this.me.game.world.getChildByType(PlayerUI).length;
      /* istanbul ignore next */
      if (playerUiCount != 2) {
        throw new Error(
          `UI State has ${playerUiCount} players on board. There should always be 2.`
        );
      }
    }
  }

  /**
   * Checks to see if graphics should be rendered
   *
   * @returns {boolean} if graphics need to be rendered
   */
  public isInGraphicsMode(): boolean {
    return !isEmpty(this.me);
  }

  /**
   * Finds the hole on which planting the given number of seed tokens one by one-
   * will stop when executed.
   *
   * @param {MoveDirection} direction Direction of the move
   * @param {Hole} hole The hole on which the move starts on
   * @param {number} numberOfSteps Number of seeds to be planted in the move
   * @returns {Hole} Hole on which the move ends on
   */
  private computeDestinationHole(
    direction: MoveDirection,
    hole: Hole,
    numberOfSteps: number
  ): Hole {
    switch (direction) {
      case MoveDirection.AntiClockwise:
        return hole.player.boardHoles.stepAntiClockwise(hole, numberOfSteps);
      case MoveDirection.Clockwise:
        return hole.player.boardHoles.stepClockwise(hole, numberOfSteps);
      default:
        /* istanbul ignore next */
        throw new Error(
          `Only Clockwise and Anticlockwise moves are allowed. Received : ${direction}`
        );
    }
  }

  /**
   * Capture all seeds from enemy if current player stopped on front row.
   *
   * @param {Hole} startHole The hole which will be capturing the enemy seeds.
   * @returns {boolean} true if the capture was successful
   */
  private captureAllSeedsFromEnemy(startHole: Hole): boolean {
    if (startHole.isInFrontRow()) {
      const opponentHole = this.getOpposingEnemyHole(startHole);
      const stolenSeedCount = opponentHole.transferAllSeedsToCurrPlayer();
      if (stolenSeedCount > 0) {
        console.info(
          `******* HOLE (${startHole.id}) CAPTURED ${stolenSeedCount} SEEDS FROM (${opponentHole.id}) ********`
        );
        this.currentPlayer.capturedOnPrevMove = true;
        return true;
      }
    }
    return false;
  }

  /**
   * Extract the opposing enemy hole from the players front row.
   *
   * @param {Hole} hole Hole from which the opposing enemy hole is to be retrieved.
   * @returns {Hole} Opposing enemy hole.
   */
  public getOpposingEnemyHole(hole: Hole): Hole {
    if (hole.isInFrontRow()) {
      const opposingId = 15 - hole.id;
      const opponentPlayer = this.getOpponentPlayer(hole.player);
      return opponentPlayer.boardHoles.getHoleWithID(opposingId);
    }
    throw new Error("Could not retrieve opposing enemy hole");
  }

  public toString(): string {
    this.updateMovesStatus();
    let buffer = "\n".concat(this.topPlayer.boardHoles.toString());
    buffer = buffer.concat(this.bottomPlayer.boardHoles.toString());
    return buffer.replace(/\n$/, ""); //remove newline at the end
  }

  /* istanbul ignore next */
  public runSimulation(randomize: boolean): void {
    const moves: Array<Move> = this.getAllAvailableValidMoves(
      this.currentPlayer
    );
    // either always pick first move or randomize
    const move = moves[randomize ? Utility.getRandomInt(moves.length) : 0];
    this.executeMove(move);
    if (!this.isGameOver()) {
      // recursively run the simulation
      this.runSimulation(randomize);
    } else {
      console.info(
        `GAME OVER ::: Winner is : \n ${this.getWinningPlayer().toString()}`
      );
      console.info(
        "GAME SCORE: \nTOP Player: " +
          this.getScore().get(PlayerSide.Top) +
          "\nBOTTOM Player: " +
          this.getScore().get(PlayerSide.Bottom)
      );
    }
  }

  /**
   * Checks if the game is over. The game is over if the current player is left
   * with no valid moves (ie. all the moves are locked).
   *
   * When the game play gets in an infinite loop, the game is also considered be
   * over. The player who gets themselves into the loop is considered to have lost
   * the game in this case.
   *
   * @returns {boolean} true if the game is over.
   */
  public isGameOver(): boolean {
    if (this.isInContinuousLoopStatus) {
      return true;
    }
    for (const hole of this.currentPlayer.boardHoles) {
      if (hole.moveStatus != MoveDirection.Locked) {
        // found a non-locked hole which means that the game is not over yet!
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the player who won the game. This only happens if the game is over.
   * opposing player is determined as the winning player since the current player
   * cannot make any moves in this case.
   *
   * @returns {Player} The winning Player.
   */
  public getWinningPlayer(): Player {
    if (this.isGameOver()) {
      return this.getOpponentPlayer(this.currentPlayer);
    } else {
      throw new Error(
        "The game is still in play. There is no winning player yet."
      );
    }
  }

  /**
   * Re-renders the state of the hole, HUD, and other UI components on the board
   */
  /* istanbul ignore next */
  public draw(state: BoardUiState): void {
    switch (state) {
      case BoardUiState.RESTING: {
        UiHelper.forEachBoardHole(this, (hole: Hole) => {
          hole.ui.label.setText(hole.ui.seedCount());
          hole.ui.sleepStateUI();
          hole.seedGroupUI.updateContainerStatus();
        });
        break;
      }
      case BoardUiState.PLAY_IN_PROGRESS: {
        UiHelper.forEachBoardHole(this, (hole: Hole) => {
          hole.ui.label.setText(hole.ui.seedCount());
          hole.ui.renderable = hole.ui.sleepingHoleSprite;
          hole.seedGroupUI.renderable.tint.setColor(105, 105, 105); //gray out all holes
        });
        break;
      }
    }

    //validate that ui and non-ui board are in sync
    UiHelper.forEachBoardHole(this, (hole: Hole) => {
      if (
        state != BoardUiState.PLAY_IN_PROGRESS &&
        hole.numSeeds != hole.ui.seedCount()
      ) {
        throw new Error(
          `UI (${hole.ui.seedCount()}) and non-UI (${
            hole.numSeeds
          }) board not in sync : ${hole.toString()}`
        );
      }
    });
  }

  /**
   * Calculates the current game score. The score is calculated as the number
   * seeds on the player side. If a player gets themselves into an infinite loop
   * move, they have lost the game.
   *
   * @returns {number} A Hash with the PlayerSide as the key and the number of seeds on that
   *         side as the value.
   */
  public getScore(): Map<PlayerSide, number> {
    if (
      this.bottomPlayer.numSeedsInHand != 0 ||
      this.topPlayer.numSeedsInHand != 0
    ) {
      throw new Error(
        "Score cannot be determined while one of the players is holding seeds in hand."
      );
    }
    const scoreMap = new Map<PlayerSide, number>();
    let btmPlayerScore = 0;
    let topPlayerScore = 0;
    for (const hole of this.bottomPlayer.boardHoles) {
      btmPlayerScore += hole.numSeeds;
    }
    scoreMap.set(PlayerSide.Bottom, btmPlayerScore);
    for (const hole of this.topPlayer.boardHoles) {
      topPlayerScore += hole.numSeeds;
    }
    scoreMap.set(PlayerSide.Top, topPlayerScore);

    // if one of the players got into an infinite loop, they are punished by
    // loosing all their seed scores to the opponent player.
    if (this.isInContinuousLoopStatus) {
      const loosingPlayerSeedCount = scoreMap.get(this.currentPlayer.side);
      const winningPlayerSeedCount = scoreMap.get(
        this.getOpponentPlayer(this.currentPlayer).side
      );
      scoreMap.set(this.currentPlayer.side, 0);
      scoreMap.set(
        this.getOpponentPlayer(this.currentPlayer).side,
        loosingPlayerSeedCount + winningPlayerSeedCount
      );
    }
    if (topPlayerScore + btmPlayerScore != AppConstants.MAX_SEED_COUNT) {
      console.info(this.toString());
      throw new Error(
        `Total score is not 64. Got : ${topPlayerScore + btmPlayerScore}`
      );
    }
    return scoreMap;
  }

  /**
   * Retrieves the opponent player for the current player.
   *
   * @param {Player} player Player whose opponent is to be determined.
   * @returns {Player} opponent player
   */
  private getOpponentPlayer(player: Player): Player {
    return player.isOnTopSide() ? this.bottomPlayer : this.topPlayer;
  }
}
export default Board;
