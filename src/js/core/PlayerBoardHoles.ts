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
 * Circular Doubly linked list representation for 2 rows of holes that are assigned to the game player.
 * Each row has 8 holes and arranged  with unique IDs.
 *
 *The holes are chained as follows:
 *
 *00		01	02	03	04	05	06	07
 *15		14	13	12	11	10	09	08
 */

import Hole from "./Hole";
import Player from "./Player";
import AppConstants from "./AppConstants";
import Board from "./Board";

class PlayerBoardHoles implements Iterable<Hole> {
  // Hole 00
  private startHole: Hole;
  // Hole 15
  private endHole: Hole;
  // The total number of holes
  private totalNumHoles: number;
  // Hole -1 - this is used as a dummy pointer to the first hole.
  private startHolePointer: Hole;
  // Hole owner
  private player: Player;
  // the board on which holes will be placed
  public readonly board: Board;

  /**
   * Constructor
   *
   * @param {Player} player the player who owns the holes
   * @param {Board} board the board on which the player is placed
   */
  constructor(player: Player, board: Board) {
    this.startHole = null;
    this.endHole = null;
    this.totalNumHoles = 0;
    this.startHolePointer = null;
    this.player = player;
    this.board = board;
  }

  /**
   * Iterator for all the holes assigned to the player
   *
   * @returns {Hole} all the holes assigned to the player
   */
  [Symbol.iterator](): Iterator<Hole> {
    let currentHole: Hole = this.startHolePointer;
    let counter = 0;
    const iterator = {
      next() {
        currentHole = currentHole.nextHole; //initially goes to first hole from dummy hole
        counter++;
        return {
          value: currentHole,
          done: counter > AppConstants.NUM_PLAYER_HOLES,
        };
      },
    };
    return iterator;
  }

  /**
   * Add new Holes at the end of the chain.
   *
   * @param {number} numSeeds Number of seeds to be placed in the hole.
   * @returns {Hole} Added Hole
   */
  public insertAtEnd(numSeeds: number): Hole {
    if (this.totalNumHoles < AppConstants.NUM_PLAYER_HOLES) {
      const newBoardHole: Hole = new Hole(
        this.player,
        this.board,
        this.totalNumHoles,
        numSeeds,
        null,
        null
      );
      if (this.startHole == null) {
        newBoardHole.nextHole = newBoardHole;
        newBoardHole.prevHole = newBoardHole;
        this.startHole = newBoardHole;
        this.endHole = this.startHole;

        this.startHolePointer = new Hole(
          this.player,
          this.board,
          AppConstants.DUMMY_HOLE_ID,
          0,
          null,
          this.startHole
        );
      } else {
        newBoardHole.prevHole = this.endHole;
        this.endHole.nextHole = newBoardHole;
        this.startHole.prevHole = newBoardHole;
        newBoardHole.nextHole = this.startHole;
        this.endHole = newBoardHole;
      }
      this.totalNumHoles++;

      //add new hole to player hole collection
      this.player.boardHoles = this;

      return newBoardHole;
    } else {
      throw new Error(
        "Only 16 holes can be added to the board for one player."
      );
    }
  }

  /**
   * Retrieves the Hole from the board using its given ID.
   *
   * @param {number} holeId ID to be used to retrieve hole
   * @returns {Hole} Retrieved hole
   */
  public getHoleWithID(holeId: number): Hole {
    this.validateHoleId(holeId);
    for (const hole of this) {
      if (hole.id === holeId) {
        return hole;
      }
    }
    throw new Error("Hole ID : " + holeId + " cannot be found. ");
  }

  /**
   * Make sure that all the 16 holes have been added before attempting to retrieve
   * any.
   *
   * @param {number} holeId Hole id to be validated.
   */
  private validateHoleId(holeId: number): void {
    if (
      holeId < AppConstants.MIN_HOLE_ID ||
      holeId > AppConstants.MAX_HOLE_ID
    ) {
      throw new Error(
        "Hole ID should fall within range 0 - 15 | Requested :" + holeId
      );
    }
    if (this.totalNumHoles != AppConstants.NUM_PLAYER_HOLES) {
      throw new Error(
        "All 16 holes belonging to the player must be added to the board before accessing them."
      );
    }
  }

  /**
   * Step back anti-clockwise for the specified number of steps.
   *
   * @param {Hole} boardHole Starting Hole
   * @param {number} numSteps  Number of steps to move backwards.
   * @returns {Hole} Hole
   */
  public stepAntiClockwise(boardHole: Hole, numSteps: number): Hole {
    this.validateNumSteps(numSteps);
    while (numSteps > 0) {
      boardHole = boardHole.prevHole;
      numSteps--;
    }
    return boardHole;
  }

  public toString(): string {
    let output = "";
    let startHole: Hole = this.getHoleWithID(0);
    // 00 01 02 03 04 05 06 07(holeIdAtFirstRowEnd) |
    // 15(holeIdAtSecondRowStart) 14 13 12 11 10 09 08 |
    const holeIdAtFirstRowEnd = 7;
    const holeIdAtSecondRowStart = 15;
    for (let i = 0; i <= holeIdAtFirstRowEnd; i++) {
      output = output.concat(startHole.toString()).concat("  ");
      startHole = startHole.nextHole;
    }
    output = output.concat("\n");
    startHole = this.getHoleWithID(holeIdAtSecondRowStart);
    for (let i = 8; i > 0; i--) {
      output = output.concat(startHole.toString()).concat("  ");
      startHole = startHole.prevHole;
    }
    output = output.concat("\n");
    return output;
  }

  /**
   * Allow positive integers less than 64 for numSteps.
   *
   * @param {number} numSteps Number of steps to be made.
   */
  private validateNumSteps(numSteps: number): void {
    if (numSteps < 1 || numSteps > AppConstants.MAX_SEED_COUNT) {
      throw new Error(
        "Number of steps should be within range 0-64 | Requested : " + numSteps
      );
    }
  }

  /**
   * Step forward clockwise for the specified number of steps.
   *
   * @param {Hole} boardHole Starting Hole
   * @param {number} numSteps  Number of steps to move backwards.
   * @returns {Hole} The destination hole.
   */
  public stepClockwise(boardHole: Hole, numSteps: number): Hole {
    this.validateNumSteps(numSteps);
    while (numSteps > 0) {
      boardHole = boardHole.nextHole;
      numSteps--;
    }
    return boardHole;
  }
}

export default PlayerBoardHoles;
