/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Board from "../core/Board";
import Hole from "../core/Hole";
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

/**
 * Bawo board seed
 */
class SeedCollectionUI extends me.DraggableEntity {
  /**
   * The Hole in which seeds will be placed
   */
  private hole: Hole;

  /**
   * the board on which the hole for this seed collection belongs to
   */
  private board: Board;

  /**
   *
   * @param {number} x  x coordinates of the hole object
   * @param {number} y  y coordinates of the hole objec
   * @param {Board} board the board on which the hole for this seed collection belongs to
   * @param {Hole} hole the hole in which the seeds are being placed
   */
  constructor(x: number, y: number, board: Board, hole: Hole) {
    const settings = {
      image: me.loader.getImage("seed-collection"),
      height: 80,
      width: 80,
      id: `seed-collection-${hole.UID}`,
    };
    super(x, y, settings);
    this.hole = hole;
    this.board = board;
    this.renderable.alpha = 0; //make container invisible
  }

  initEvents(): void {
    super.initEvents();
    // Remove the old pointerdown and pointerup events.
    this.removePointerEvent("pointerdown", this);
    this.removePointerEvent("pointerup", this);

    // Define the new events that return false (don't fall through).
    this.mouseDown = (e: any) => {
      // Do not allow player to make moves on hole that does not belong to them
      if (!this.isHoleOwner()) {
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGSTART);
      return false;
    };
    this.mouseUp = (e: any) => {
      // Do not allow player to make moves on hole that does not belong to them
      if (!this.isHoleOwner()) {
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGEND);
      return false;
    };

    this.pointerEnter = () => {
      if (this.isHoleOwner()) {
        this.renderable.alpha = 1;
      }
    };

    this.pointerLeave = () => {
      if (this.isHoleOwner()) {
        this.renderable.alpha = 0;
      }
    };

    // Add the new pointerdown and pointerup events.
    this.onPointerEvent("pointerdown", this, this.mouseDown.bind(this));
    this.onPointerEvent("pointerup", this, this.mouseUp.bind(this));
    this.onPointerEvent("pointerenter", this, this.pointerEnter.bind(this));
    this.onPointerEvent("pointerleave", this, this.pointerLeave.bind(this));
  }

  dragStart(event: any): void {
    super.dragStart(event);
  }

  dragEnd(event: any): void {
    super.dragEnd(event);
    this.getAllSeeds().forEach((element: SeedUI, index: number) => {
      element.pos.x += 10 * index; //TODO from Hole render method
      element.pos.y += 10 * index; //TODO from Hole render method
    });
  }

  dragMove(event: any): void {
    if (this.dragging == true) {
      this.getAllSeeds().forEach((element: SeedUI) => {
        element.pos.x = this.pos.x;
        element.pos.y = this.pos.y;
      });
    }
    super.dragMove(event);
  }

  private isHoleOwner(): boolean {
    return this.board.getCurrentPlayer() == this.hole.player;
  }

  private getAllSeeds(): Array<SeedUI> {
    return me.game.world.getChildByProp("id", `seed-${this.hole.UID}`);
  }
}

export default SeedCollectionUI;
