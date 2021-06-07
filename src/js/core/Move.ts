import Hole from "./Hole";
import Board from "./Board";
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
  public readonly board: Board;
  public direction: MoveDirection;
  /**
   *
   * @param prevContinuedMovesCount the number of subsequent (continued) moves executed before current move
   * @param hole the hole on which the moves starts on
   * @param board the board on which the move is being performed
   * @param direction move direction
   */
  constructor(
    board: Board,
    hole: Hole,
    direction: MoveDirection,
    prevContinuedMovesCount = 0
  ) {
    this.prevContinuedMovesCount = prevContinuedMovesCount;
    this.hole = hole;
    this.board = board;
    this.direction = direction;
  }
  /**
   * Determines if a move is continuing. This happens when previous moves have
   * been executed before this move.
   *
   * @return {@code true} if the move is continuing.
   */
  public isContinuing(): boolean {
    return this.prevContinuedMovesCount > 0;
  }
  public isCapture(): boolean {
    const destinationHole: Hole = this.getDestinationHole();
    // General Bawo capture rule 1: atleast 2 seeds must be present in players hole for a move to result into a valid capture
    // General Bawo capture rule 2: move should end on the front row of the players board side
    // General Bawo capture rule 3: Seed(s) must be present in the first row destination hole
    // General Bawo capture rule 4: Seed(s) must be present in the opponents opposing hole
    if (
      this.hole.numSeeds > 1 &&
      destinationHole.isInFrontRow() &&
      !destinationHole.isEmpty() &&
      !this.board.adjacentOpponentHole(destinationHole).isEmpty()
    ) {
      return true;
    }
    return false;
  }

  public isNonCaptureStartingOnFrontRow(): boolean {
    return false;
  }
  public isNonCaptureStartingOnBackRow(): boolean {
    return false;
  }

  /**
   *
   * Gets the hole on which the specified move will be planting the last seed in
   * the players hand.
   *
   * @param move Move to be performed
   * @return Hole on which the move ends
   */
  private getDestinationHole(): Hole {
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
