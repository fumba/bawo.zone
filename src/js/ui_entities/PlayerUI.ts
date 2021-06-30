import Player from "../core/Player";
import me from "../me";
import SeedUI from "./SeedUI";
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
/* istanbul ignore next */
class PlayerUI extends me.Entity {
  /**
   * Seeds that the player has in their hand
   */
  public seedsInHand: Array<SeedUI>;

  constructor(player: Player) {
    const settings = {
      //TODO image: me.loader.getImage(AppConstants.PLAYER_UI),
      height: 20,
      width: 20,
      id: player.side,
    };
    super(0, 0, settings);
    this.seedsInHand = [];
  }

  /**
   * Adds seed to player hand
   *
   * @param {SeedUI} seedUI seed to be added in player hand
   */
  public addSeed(seedUI: SeedUI): void {
    this.seedsInHand.push(seedUI);
  }

  /**
   * Removes seed from player hand
   *
   * @returns {SeedUI} seeds that was removed from players hand
   */
  public removeSeed(): SeedUI {
    return this.seedsInHand.pop();
  }
}

export default PlayerUI;
