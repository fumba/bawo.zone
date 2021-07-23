/* bawo.zone - <a href="https://bawo.zone">https://bawo.zone</a>
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
 * <p>
 * {@link PlayerSide} represent the sides that a player can be on the board
 * </p>
 */

/**
 * Move direction: Only clockwise and anti-clockwise moves are allowed when the
 * player is executing a move.
 *
 * Each hole has a move status during gameplay. If both Clockwise and
 * anti-clockwise moves can be performed, the status is marked as Both. Holes
 * with no valid moves are marked as locked. Holes that do not belong to the
 * current player are marked as Unauthorized.
 *
 * <p>
 * The direction in which a move can be made.
 * </p>
 *
 * <p>
 * Note: When executing moves, only {@link MoveDirection#Clockwise} and
 * {@link MoveDirection#AntiClockwise} are valid values. Each Hole has a move
 * status during gameplay, if both Clockwise and anti-clockwise moves can be
 * performed, the status is marked as {@link MoveDirection#Both}. Holes with no
 * valid moves are marked as {@link MoveDirection#Locked}. Holes that do not
 * belong to the current player are marked as
 * {@link MoveDirection#Unathorised}.
 * </p>
 */

enum MoveDirection {
  AntiClockwise = "A",
  Clockwise = "C",
  Both = "B",
  Locked = "L",
  UnAuthorized = "X",
}

export default MoveDirection;
