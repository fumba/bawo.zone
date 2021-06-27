import AppConstants from "../core/AppConstants";
import Hole from "../core/Hole";
import me from "../me";
import SeedUI from "./SeedUI";
import Vector from "../core/Vector";

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
class SeedGroupUI extends me.DraggableEntity {
  /**
   * The Hole in which seeds will be placed
   */
  public readonly hole: Hole;

  /**
   * initial position for the seed group before it was dragged
   */
  private readonly originalPos: Vector;

  /**
   * seed group entity radius
   */
  public readonly radius: number;

  /**
   * initial center position
   */
  public readonly originalCenter: Vector;

  /**
   * @param {Hole} hole the hole in which the seeds are being placed
   */
  constructor(hole: Hole) {
    const settings = {
      image: me.loader.getImage(AppConstants.SEED_GROUP_UI),
      height: 50,
      width: 50,
      id: `${AppConstants.SEED_GROUP_UI}-${hole.UID}`,
    };

    //Readjust x and y coordinates since they are based hole values which contains the smaller seedgroup entity
    const holeUI = hole.ui;
    const x_i = holeUI.pos.x + (holeUI.width - settings.width) / 2;
    const y_i = holeUI.pos.y + (holeUI.height - settings.height) / 2;

    super(x_i, y_i, settings);
    this.originalPos = new Vector(this.pos.x, this.pos.y, this.pos.z);
    this.originalCenter = new Vector(
      this.pos.x + settings.width / 2,
      this.pos.y + settings.height / 2,
      this.pos.z
    );
    this.radius = settings.height / 2;
    this.hole = hole;
    this.renderable.alpha = 0; //make container invisible
  }

  initEvents(): void {
    super.initEvents();
    // Remove the old pointerdown and pointerup events.
    this.removePointerEvent("pointerdown", this);
    this.removePointerEvent("pointerup", this);

    const isPlayableHole = () =>
      this.hole.availableMovesForCurrentPlayer().length > 0;

    // Define the new events that return false (don't fall through).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.mouseDown = (e: any) => {
      // Do not allow player to make moves on hole that does not belong to them
      if (!isPlayableHole()) {
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGSTART);
      return false;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.mouseUp = (e: any) => {
      // Do not allow player to make moves on hole that does not belong to them
      if (!isPlayableHole()) {
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGEND);

      //move back draggable seed group container to its initial position
      this.pos.x = this.originalPos.x;
      this.pos.y = this.originalPos.y;
      this.renderable.alpha = 0;
      return false;
    };

    this.pointerEnter = () => {
      if (isPlayableHole()) {
        this.renderable.alpha = 1;
      }
    };

    this.pointerLeave = () => {
      this.renderable.alpha = 0;
    };

    // Add the new pointerdown and pointerup events.
    this.onPointerEvent("pointerdown", this, this.mouseDown.bind(this));
    this.onPointerEvent("pointerup", this, this.mouseUp.bind(this));
    this.onPointerEvent("pointerenter", this, this.pointerEnter.bind(this));
    this.onPointerEvent("pointerleave", this, this.pointerLeave.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  dragStart(event: any): void {
    super.dragStart(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  dragEnd(event: any): void {
    super.dragEnd(event);
    this.getAllUISeeds().forEach((seed: SeedUI) => {
      seed.randomisePosition();
      seed.pos.z = seed.originalPos.z;
    });
    this.pos.z = this.originalPos.z;
    me.game.world.sort(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  dragMove(event: any): void {
    if (this.dragging == true) {
      this.getAllUISeeds().forEach((seed: SeedUI) => {
        seed.pos.x = this.pos.x;
        seed.pos.y = this.pos.y;
        seed.pos.z = Infinity;
      });
      this.pos.z = Infinity;
      me.game.world.sort(true);
    }
    super.dragMove(event);
  }

  public getAllUISeeds(): Array<SeedUI> {
    return me.game.world.getChildByProp(
      "id",
      SeedUI.seedGroupId(this.hole.UID)
    );
  }
}

export default SeedGroupUI;
