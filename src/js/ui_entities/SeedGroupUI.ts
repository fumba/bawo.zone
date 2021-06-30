import AppConstants from "../core/AppConstants";
import Hole from "../core/Hole";
import me from "../me";
import SeedUI from "./SeedUI";
import Vector from "../core/Vector";
import UiHelper from "./UiHelper";
import HoleUI from "./HoleUI";

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
    this.renderable.alpha = 0.1;
  }

  initEvents(): void {
    super.initEvents();

    const isPlayableHole = () =>
      this.hole.availableMovesForCurrentPlayer().length > 0;

    this.pointerDown = (e: unknown) => {
      if (!isPlayableHole()) {
        // Do not allow player to make moves on hole that does not belong to them
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGSTART);
      return false;
    };

    this.pointerUp = (e: unknown) => {
      if (!isPlayableHole()) {
        // Do not allow player to make moves on hole that does not belong to them
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGEND);
      //move back draggable seed group container to its initial position
      this.resetToOriginalPosition();
      return false;
    };

    this.pointerEnter = () => {
      const draggingSeedGroup = UiHelper.getCurrentDraggingSeedGroup(me);
      if (draggingSeedGroup) {
        const selectedHole = draggingSeedGroup.hole;
        const currDirection = selectedHole.adjacencyDirection(this.hole);
        const validDirections = selectedHole
          .availableMovesForCurrentPlayer()
          .map((move) => move.direction);
        if (validDirections.includes(currDirection)) {
          this.hole.ui.renderable = this.hole.ui.availableHoleSprite;
        } else {
          this.hole.ui.renderable = this.hole.ui.blockedHoleSprite;
        }
      }
    };

    this.pointerLeave = () => {
      const draggingSeedGroup = UiHelper.getCurrentDraggingSeedGroup(me);
      // set hole status to sleeping on mouse leave unless the hole is an adjacent valid move
      if (draggingSeedGroup) {
        if (!draggingSeedGroup.hole.adjacencyDirection(this.hole)) {
          this.hole.ui.renderable = this.hole.ui.sleepingHoleSprite;
        }
      }
    };

    this.onPointerEvent("pointerdown", this, this.pointerDown.bind(this));
    this.onPointerEvent("pointerup", this, this.pointerUp.bind(this));
    this.onPointerEvent("pointerenter", this, this.pointerEnter.bind(this));
    this.onPointerEvent("pointerleave", this, this.pointerLeave.bind(this));
  }

  public resetToOriginalPosition(): void {
    this.pos.x = this.originalPos.x;
    this.pos.y = this.originalPos.y;
    this.pos.z = this.originalPos.z;
  }

  dragStart(event: unknown): void {
    super.dragStart(event);
    UiHelper.forEachUiHole(
      // all holes (apart from available moves) should be in sleeping mode while drag action is in progress
      (holeUI: HoleUI) => {
        if (this.hole.adjacencyDirection(holeUI.hole)) {
          holeUI.renderable = holeUI.availableHoleSprite;
        } else {
          holeUI.renderable = holeUI.sleepingHoleSprite;
        }
      },
      me
    );
  }

  dragEnd(event: unknown): void {
    super.dragEnd(event);
    UiHelper.forEachUiSeedInHole(this.hole, (seedUI: SeedUI) => {
      seedUI.randomisePosition();
      seedUI.pos.z = seedUI.originalPos.z;
    });

    UiHelper.forEachUiHole(
      //restore hole status
      (holeUI: HoleUI) => holeUI.sleepStateUI(),
      me
    );
    me.game.world.sort(true);
  }

  dragMove(event: unknown): void {
    super.dragMove(event);
    if (this.dragging == true) {
      this.hole.ui.renderable = this.hole.ui.startHoleSprite;
      UiHelper.forEachUiSeedInHole(this.hole, (seedUI: SeedUI) => {
        seedUI.pos.x = this.pos.x;
        seedUI.pos.y = this.pos.y;
        seedUI.pos.z = Infinity;
      });
      this.pos.z = Infinity;
      me.game.world.sort(true);
    }
  }
}

export default SeedGroupUI;
