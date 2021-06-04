/*
 * bawo.zone - <a href="https://bawo.zone">https://bawo.zone</a>
 * <a href="https://github.com/fumba/bawogame">https://github.com/fumba/bawogame</a>
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

import PlayerSide from "./PlayerSide";
/**
 * <p>
 * {@link Player} represents a bawo game player
 * </p>
 *
 * @since 1.0
 **/
class Player {
  //player can take up either TOP or BOTTOM side of the board
  public side: PlayerSide;

  /**
   * constructor
   * @param side the side on which the player is on the board
   */
  constructor(side: PlayerSide) {
    this.side = side;
  }
}

export default Player;
