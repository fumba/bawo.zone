import Utility from "../Utility";
import Board from "./Board";
import Move from "./Move";

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
class AI {
  /**
   * Computes the best move that the computer can perform
   *
   * @param {Board} board the board on which the move will be performed on
   * @returns {Move} the best move that the CPU can make
   */
  public static computeBestMove(board: Board): Move {
    const boardClone: Board = board.clone();
    const moves: Array<Move> = boardClone.getAllAvailableValidMoves(
      board.getCurrentPlayer()
    );
    const move = moves[Utility.getRandomInt(moves.length)];
    return move;
  }

  // compute optimal move for current player
  public static minimax(
    depth: number,
    nodeIndex: number,
    maximizingPlayer: boolean,
    values: Array<number>,
    alpha: number,
    beta: number
  ): number {
    // Terminating condition. i.e
    // leaf node is reached
    if (depth == 0) return values[nodeIndex];

    if (maximizingPlayer) {
      let best = Number.NEGATIVE_INFINITY;

      // Recur for left and
      // right children
      for (let i = 0; i < 2; i++) {
        const score = AI.minimax(
          depth - 1,
          nodeIndex * 2 + i,
          false,
          values,
          alpha,
          beta
        );
        best = Math.max(best, score);
        alpha = Math.max(alpha, best);

        // Alpha Beta Pruning
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Number.POSITIVE_INFINITY;

      // Recur for left and
      // right children
      for (let i = 0; i < 2; i++) {
        const score = AI.minimax(
          depth - 1,
          nodeIndex * 2 + i,
          true,
          values,
          alpha,
          beta
        );
        best = Math.min(best, score);
        beta = Math.min(beta, best);

        // Alpha Beta Pruning
        if (beta <= alpha) break;
      }
      return best;
    }
  }
}

// Driver Code
const values = [3, 5, 6, 9, 1, 2, 0, -1];
console.log(
  "The optimal value is : " +
    AI.minimax(
      3,
      0,
      true,
      values,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    )
);

export default AI;
