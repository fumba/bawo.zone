import ScoreMovePair from "./ScoreMovePair";
import Board from "./Board";
import Move from "./Move";
import Player from "./Player";

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
    const clonedBoard: Board = board.clone();
    const depth = 3;
    const player = board.getCurrentPlayer(); //cpu player
    const bestMove = AI.minimax(
      player,
      depth,
      null, //todo ?
      clonedBoard,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    ).move;

    // move will be performed on board (not cloned board)
    bestMove.hole = board
      .getCurrentPlayer()
      .boardHoles.getHoleWithID(bestMove.hole.id);
    return bestMove;
  }

  // compute optimal move for current player
  public static minimax(
    player: Player,
    depth: number,
    currentMove: ScoreMovePair,
    board: Board,
    alpha: number,
    beta: number
  ): ScoreMovePair {
    console.info("MINMAX ENTER ---- ");
    console.info("CPU PLAYER ", player);
    console.info("BOARD ON MINMAX ENTER ", board.toString());
    // Terminating condition. i.e
    // leaf node is reached
    if (depth == 0) return currentMove;

    // maximizing player
    if (player.side == board.getCurrentPlayer().side) {
      console.info("> current: MAXIMIZING PLAYER");
      let best = new ScoreMovePair(Number.NEGATIVE_INFINITY, null);
      const moves: Array<Move> = board.getAllAvailableValidMoves(
        board.getCurrentPlayer()
      );
      for (const move of moves) {
        const clonedBoard: Board = board.clone();
        // move will be performed on cloned board
        move.hole = clonedBoard
          .getCurrentPlayer()
          .boardHoles.getHoleWithID(move.hole.id);

        console.info("> MAXIMIZING MOVE ", move);
        console.info("> CLONED-BOARD ", clonedBoard.toString());
        console.info("> CLONED-BOARD PLAYER ", clonedBoard.getCurrentPlayer());
        clonedBoard.executeMove(move); //players are switched after every move execution
        const score = clonedBoard.getScore().get(player.side);
        const scoreMovePair = AI.minimax(
          player,
          depth - 1,
          new ScoreMovePair(score, move),
          clonedBoard,
          alpha,
          beta
        );
        if (best.score < scoreMovePair.score) {
          best = new ScoreMovePair(score, move); //maximize score
        }
        alpha = Math.max(alpha, best.score);

        // Alpha Beta Pruning
        if (beta <= alpha) break;
      }
      return best;
    } else {
      //minimizing player
      console.info("> current: MINIMIZING PLAYER");
      let best = new ScoreMovePair(Number.POSITIVE_INFINITY, null);
      const moves: Array<Move> = board.getAllAvailableValidMoves(
        board.getCurrentPlayer()
      );
      for (const move of moves) {
        const clonedBoard: Board = board.clone();
        // move will be performed on cloned board
        move.hole = clonedBoard
          .getCurrentPlayer()
          .boardHoles.getHoleWithID(move.hole.id);

        console.info("> MINIMIZING MOVE ", move);
        console.info("> CLONED-BOARD ", clonedBoard.toString());
        console.info("> CLONED-BOARD PLAYER ", clonedBoard.getCurrentPlayer());
        clonedBoard.executeMove(move); //players are switched after every move execution
        const score = clonedBoard.getScore().get(player.side);
        const scoreMovePair = AI.minimax(
          player,
          depth - 1,
          new ScoreMovePair(score, move),
          clonedBoard,
          alpha,
          beta
        );
        if (best.score > scoreMovePair.score) {
          best = new ScoreMovePair(score, move); //minimize score
        }
        beta = Math.min(beta, best.score);

        // Alpha Beta Pruning
        if (beta <= alpha) break;
      }
      return best;
    }
  }
}

export default AI;
