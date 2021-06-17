import Hole from "./Hole";
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
class Move {
  public prevContinuedMovesCount: number;
  public hole: Hole;
  public direction: MoveDirection;
  public readonly possibleDirections = [
    MoveDirection.AntiClockwise,
    MoveDirection.Clockwise,
  ];
  /**
   * <p>
   * Mtaji moves result into a capture on the initial move. This switch is set to
   * {@code false} for all subsequent continuing moves if the initial move did not
   * result into a capture.
   * </p>
   * <p>
   * The default value for this switch is initially set to {@code true} with the
   * assumption that every move that a {@link Player} initiates has the potential
   * to result into a capture.
   * </p>
   */
  public isMtaji: boolean;

  /**
   * constrtuctor
   *
<<<<<<< HEAD
=======
   * @param {board} board the board on which the move is being performed
>>>>>>> bb7b7c0 (added param types to ts move ts file)
   * @param {Hole} hole the hole on which the moves starts on
   * @param {MoveDirection} direction move direction
   * @param {number} prevContinuedMovesCount the number of subsequent (continued) moves executed before current move
   */
  constructor(
    hole: Hole,
    direction: MoveDirection,
    prevContinuedMovesCount = 0
  ) {
    this.prevContinuedMovesCount = prevContinuedMovesCount;
    this.hole = hole;
    this.direction = direction;
    this.isMtaji = true;
  }
  /**
   * Determines if a move is continuing. This happens when previous moves have
   * been executed before this move.
   *
   * @returns  {true} if the move is continuing.
   */
  public isContinuing(): boolean {
    return this.prevContinuedMovesCount > 0;
  }

  public toString(): string {
    let buffer = "";
    buffer = buffer.concat("\nMOVE [ dir : " + this.direction);
    buffer = buffer.concat(", owner :" + this.hole.player.side);
    buffer = buffer.concat(", hole id :" + this.hole.id);
    buffer = buffer.concat(", seed count:" + this.hole.numSeeds);
    buffer = buffer.concat(", step count :" + this.prevContinuedMovesCount);
    buffer = buffer.concat(", isMtaji:" + this.isMtaji + " \n");
    buffer = buffer.concat("\n");
    return buffer;
  }

  /**
   * Checks to see if the move results into seed tokens being put in any front row
   * hole that is assigned to the player.
   *
   * @returns {boolean} true if move sows seed in any front row hole
   */
  public sowsSeedInFrontHole(): boolean {
    let hole: Hole = this.hole;
    for (let i = 0; i < this.hole.numSeeds; i++) {
      if (this.direction == MoveDirection.Clockwise) {
        if (hole.nextHole.isInFrontRow()) {
          return true;
        }
        hole = hole.nextHole;
      } else if (this.direction == MoveDirection.AntiClockwise) {
        if (hole.prevHole.isInFrontRow()) {
          return true;
        }
        hole = hole.prevHole;
      }
    }
    return false;
  }

  /**
   *
   * Gets the hole on which the specified move will be planting the last seed in
   * the players hand.
   *
   * @param Move Move to be performed
   * @returns {Hole} Hole on which the move ends
   */
  public getDestinationHole(): Hole {
    switch (this.direction) {
      case MoveDirection.Clockwise:
        return this.hole.player.boardHoles.stepClockwise(
          this.hole,
          this.hole.numSeeds
        );
      case MoveDirection.AntiClockwise:
        return this.hole.player.boardHoles.stepAntiClockwise(
          this.hole,
          this.hole.numSeeds
        );
      default:
        throw new Error(
          "Only Clockwise and Anticlockwise moves are allowed. Input : " +
            this.direction
        );
    }
  }
}
export default Move;
