import Utility from "../Utility";
import AppConstants from "../core/AppConstants";
import Vector from "../core/Vector";
import me from "../me";
import SeedGroupUI from "./SeedGroupUI";
import Board from "../core/Board";
import { isEmpty } from "lodash";

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
 * Bawo board seed
 */
/* istanbul ignore next */
class SeedUI extends me.Entity {
  /**
   * the group to which this seed belongs to
   */
  public group: SeedGroupUI;

  public board: Board;

  /**
   * initial position for the seed  before it was dragged
   */
  public readonly originalPos: Vector;

  /**
   * @param {SeedUI} seedGroup - group to which this seed belongs to
   * @param {number} uid - unique hole uid
   */
  constructor(seedGroup: SeedGroupUI, uid: string) {
    const settings = {
      image: me.loader.getImage(AppConstants.SEED_UI),
      height: 20,
      width: 20,
      id: SeedUI.seedGroupId(uid),
    };
    super(0, 0, settings);

    this.originalPos = new Vector(this.pos.x, this.pos.y, this.pos.z);
    this.group = seedGroup;
    this.board = seedGroup.hole.board;
    this.randomisePosition();
  }

  /**
   * Randomizes the position of the seed in the hole - seed group container
   */
  public randomisePosition(): void {
    const location = isEmpty(this.group)
      ? this.board.getCurrentPlayer().ui
      : this.group;
    const randomSeedPoint = Utility.randomPointWithinCircle(
      location.radius(),
      location.center().x,
      location.center().y
    );
    this.pos.x = randomSeedPoint.x - this.height / 2;
    this.pos.y = randomSeedPoint.y - this.width / 2;

    this.putOnTopOfContainer();
    this.renderable.rotate(Math.random() * Math.PI * 2); //random rotation
  }

  public putOnTopOfContainer(): void {
    const location = isEmpty(this.group)
      ? this.board.getCurrentPlayer().ui
      : this.group;
    this.pos.z = location.pos.z + 1;
    me.game.world.sort(true);
  }

  public static seedGroupId(uid: string): string {
    return `${AppConstants.SEED_UI}-${uid}`;
  }
}

export default SeedUI;
