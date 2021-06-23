/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Logger from "../../helpers/Logger";
import AppConstants from "../core/AppConstants";
import me from "../me";

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
class SeedUI extends me.DraggableEntity {
  /**
   *
   * @param {number} id Unique id for seed
   * @param {number} x  x coordinates of the seed object
   * @param {number} y  y coordinates of the seed object
   */
  constructor(id: number, x: number, y: number) {
    const settings = {
      image: me.loader.getImage("seed"),
      height: 25,
      width: 25,
      id: id,
    };
    super(x, y, settings);
    //Logger.info("seed", SeedUI.name);
  }

  dragStart(event: any): void {
    Logger.info(`seed drag start - hole ${this.id}`, SeedUI.name);
    this.dragging = true;
    super.dragStart(event);
  }

  dragEnd(event: any): void {
    super.dragEnd(event);
    const allSeeds = me.game.world.getChildByProp("id", this.id);
    allSeeds.forEach((element: SeedUI, index: number) => {
      element.pos.x += 10 * index; //TODO from Hole render method
      element.pos.y += 10 * index; //TODO from Hole render method
      element.dragging = false;
    });
    Logger.info(`seed drag end - hole ${this.id}`, SeedUI.name);
  }

  dragMove(event: any): void {
    if (this.dragging == true) {
      const allSeeds = me.game.world.getChildByProp("id", this.id);
      const currentSeedIndex = allSeeds.indexOf(this);
      allSeeds.splice(currentSeedIndex, 1);
      allSeeds.forEach((element: SeedUI) => {
        if (element.dragging == false) {
          element.pos.x = this.pos.x;
          element.pos.y = this.pos.y;
        }
      });
    }
    super.dragMove(event);
  }
}

export default SeedUI;
