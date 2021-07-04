import AppConstants from "../core/AppConstants";
import Player from "../core/Player";
import Vector from "../core/Vector";
import me from "../me";
import HoleUI from "./HoleUI";
import SeedGroupUI from "./SeedGroupUI";
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
      image: me.loader.getImage(AppConstants.PLAYER_UI),
      height: 100,
      width: 100,
      id: player.side,
    };
    super(0, 0, settings);

    this.renderable.alpha = 0;
    this.renderable.tint.setColor(153, 76, 0);
    this.seedsInHand = [];
  }

  /**
   * Adds seed to player hand
   *
   * @param {SeedUI} seedUI seed to be added in player hand
   */
  public addSeed(seedUI: SeedUI): void {
    this.seedsInHand.push(seedUI);
    this.renderable.alpha = 1;
    this.positionHand(seedUI.group.hole.ui);
    me.game.world.sort(true);
  }

  private positionHand(holeUI: HoleUI) {
    this.pos.x = holeUI.pos.x - (this.width - holeUI.width) / 2;
    this.pos.y = holeUI.pos.y - (this.height - holeUI.height) / 2;
    this.pos.z = Number.MAX_SAFE_INTEGER; //layers : hole, seed, hand
  }

  /**
   * Removes seed from player hand
   *
   * @param {SeedGroupUI} seedGroupUI draggable hole container into which seed will be placed
   * @returns {SeedUI} seeds that was removed from players hand
   */
  public removeSeed(seedGroupUI: SeedGroupUI): SeedUI {
    this.positionHand(seedGroupUI.hole.ui);

    if (this.seedsInHand.length == 1) {
      this.renderable.alpha = 0;
    }
    me.game.world.sort(true);
    return this.seedsInHand.pop();
  }

  /**
   *
   * @returns {Vector} vector representing the center point for the hand
   */
  public center(): Vector {
    return new Vector(
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 1.5, //slightly lower so that seeds are placed in palm
      this.pos.z
    );
  }

  public radius(): number {
    return this.height / 10; //shorter radius compared to SeedGroupUI
  }
}

export default PlayerUI;
