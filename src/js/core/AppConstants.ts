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
 * <p>
 * Immutable values that are used throughout bawo.zone application.
 * {@link AppConstants} keeps track of both values used by the backend logic and
 * the game GUI.
 * </p>
 */
class AppConstants {
  /**
   * Maximum number of seeds that can be used to play the bawo game.
   */
  public static readonly MAX_SEED_COUNT: number = 64;

  /**
   * Number of holes that a bawo game {@link Player} gets. This represents two
   * rows of holes - each row with 8 holes. These two rows are represented by
   * {@link BawoCircularDoublyLinkedList} - a circular linked list with 16 holes
   * (nodes).
   */
  public static readonly NUM_PLAYER_HOLES: number = 16;

  /**
   * Maximum Hole ID.
   */
  public static readonly MAX_HOLE_ID: number = 15;

  /**
   * Minimum Hole ID. Note that {@link DUMMY_HOLE_ID} is not a Hole that is used
   * during gameplay.
   */
  public static readonly MIN_HOLE_ID: number = 0;

  /**
   * The amount of moves that a player is allowed to make during a game play. If
   * they go beyond this count, they are regarded to be in infinite state and have
   * lost the game.
   */
  public static readonly INFINITE_LOOP_THRESHOLD: number = 50;

  /**
   * This id identifies the dummy hole (pointer). See PlayerBoardHoles
   */
  public static readonly DUMMY_HOLE_ID = -1;

  /**
   * Seed UI
   */
  public static readonly SEED_UI = "seed-ui";

  /**
   * Hole UI
   */
  public static readonly HOLE_UI = "hole-ui";

  /**
   * Seed Group UI
   */
  public static readonly SEED_GROUP_UI = "seed-group-ui";

  /**
   * Player UI
   */
  public static readonly PLAYER_UI = "player-ui";
}

export default AppConstants;
