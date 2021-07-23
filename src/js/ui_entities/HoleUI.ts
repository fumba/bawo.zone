import AppConstants from "../core/AppConstants";
import Hole from "../core/Hole";
import Move from "../core/Move";
import me from "../me";
import SeedGroupUI from "./SeedGroupUI";
import UiHelper from "./UiHelper";

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
 * Bawo board hole
 */
/* istanbul ignore next */
class HoleUI extends me.DroptargetEntity {
  public readonly hole: Hole;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sleepingHoleSprite: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public availableHoleSprite: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public blockedHoleSprite: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public startHoleSprite: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public label: any;

  /**
   * @param {Hole} hole the hole to which this UI entity corresponds to
   */
  constructor(hole: Hole) {
    const settings = {
      height: 80,
      width: 80,
      id: `${AppConstants.HOLE_UI}-${hole.UID}`,
    };

    let xOffSet = 40;
    const newRowOffset = hole.id <= 7 ? 0 : 100;
    let xFactor = hole.id < 8 ? hole.id : 15 - hole.id;
    let yFactor = 0;

    // nyumba hole x-location
    if (hole.id == AppConstants.NYUMBA_HOLE_ID) {
      xFactor = 8;
      xOffSet = xOffSet + 20;
      yFactor = 50;
    }

    const x = xFactor * 90 + xOffSet;
    const y = (hole.player.isOnTopSide() ? 150 : 380) - yFactor + newRowOffset;

    super(x, y, settings);
    // overlaps are not valid drops
    // draggable seed container UI (SeedGroupUI) has a smaller radius so all drops are expected
    // to be contained within the hole radius.
    this.setCheckMethod(this.CHECKMETHOD_CONTAINS);
    this.hole = hole;

    //load sprite for the different hole variations - available and locked
    this.availableHoleSprite = new me.Sprite(0, 0, {
      image: me.loader.getImage(AppConstants.HOLE_AVAILABLE_UI),
    });
    this.sleepingHoleSprite = new me.Sprite(0, 0, {
      image: me.loader.getImage(AppConstants.HOLE_SLEEPING_UI),
    });
    this.blockedHoleSprite = new me.Sprite(0, 0, {
      image: me.loader.getImage(AppConstants.HOLE_BLOCKED_UI),
    });
    this.startHoleSprite = new me.Sprite(0, 0, {
      image: me.loader.getImage(AppConstants.HOLE_START_UI),
    });

    this.sleepStateUI();
    this.renderable.alpha = 0.8;

    this.label = new me.Text(this.pos.x + 15, this.pos.y - 12, {
      font: "Arial",
      size: 15,
      fillStyle: this.color,
    });
    this.label.setText(this.seedCount());
    me.game.world.addChild(this.label);
  }

  public sleepStateUI(): void {
    if (this.hole.availableMovesForCurrentPlayer().length > 0) {
      this.renderable = this.availableHoleSprite;
    } else {
      this.renderable = this.sleepingHoleSprite;
    }
  }

  drop(seedGroupUI: SeedGroupUI): void {
    // do not perform move if a drag and drop is performed on the same hole
    const startingHole = seedGroupUI.hole;
    if (startingHole.UID != this.hole.UID) {
      console.info(`${seedGroupUI.id} dropped into ${this.id}`);
      // only perform move only on destination holes that are adjacent from the starting hole
      const moveDirection = startingHole.adjacencyDirection(this.hole);
      if (moveDirection) {
        const move = new Move(startingHole, moveDirection);
        console.info(`UI requesting move:  \n\t: ${move}`);
        this.hole.board.executeMove(move);
      }
    } else {
      console.info(
        "drag and dropped into the same hole, ",
        seedGroupUI.id,
        this.id
      );
    }
  }

  public seedCount(): number {
    let count = 0;
    UiHelper.forEachUiSeedInHole(this.hole, () => {
      count++;
    });
    return count;
  }
}

export default HoleUI;
