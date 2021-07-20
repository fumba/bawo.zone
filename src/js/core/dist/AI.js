"use strict";
exports.__esModule = true;
var Utility_1 = require("../Utility");
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
var AI = /** @class */ (function () {
    function AI() {
    }
    /**
     * Computes the best move that the computer can perform
     *
     * @param {Board} board the board on which the move will be performed on
     * @returns {Move} the best move that the CPU can make
     */
    AI.computeBestMove = function (board) {
        var boardClone = board.clone();
        var moves = boardClone.getAllAvailableValidMoves(board.getCurrentPlayer());
        var move = moves[Utility_1["default"].getRandomInt(moves.length)];
        return move;
    };
    // Returns optimal value for
    // current player (Initially called
    // for root and maximizer)
    AI.minimax = function (depth, nodeIndex, maximizingPlayer, values, alpha, beta) {
        // Terminating condition. i.e
        // leaf node is reached
        if (depth == 3)
            return values[nodeIndex];
        if (maximizingPlayer) {
            var best = Number.MIN_VALUE;
            // Recur for left and
            // right children
            for (var i = 0; i < 2; i++) {
                var val = AI.minimax(depth + 1, nodeIndex * 2 + i, false, values, alpha, beta);
                best = Math.max(best, val);
                alpha = Math.max(alpha, best);
                console.log(alpha, best);
                // Alpha Beta Pruning
                if (beta <= alpha)
                    break;
            }
            return best;
        }
        else {
            var best = Number.MIN_VALUE;
            // Recur for left and
            // right children
            for (var i = 0; i < 2; i++) {
                var val = AI.minimax(depth + 1, nodeIndex * 2 + i, true, values, alpha, beta);
                best = Math.min(best, val);
                beta = Math.min(beta, best);
                console.log(alpha, best);
                // Alpha Beta Pruning
                if (beta <= alpha)
                    break;
            }
            return best;
        }
    };
    return AI;
}());
exports["default"] = AI;
// Driver Code
var values = [3, 5, 6, 9, 1, 2, 0, -1];
console.log("The optimal value is : " +
    AI.minimax(0, 0, true, values, Number.MIN_VALUE, Number.MAX_VALUE));

//# sourceMappingURL=AI.js.map
