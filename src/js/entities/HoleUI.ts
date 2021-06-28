import AppConstants from "../core/AppConstants";
import Hole from "../core/Hole";
import Move from "../core/Move";
import me from "../me";
import SeedGroupUI from "./SeedGroupUI";

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
class HoleUI extends me.DroptargetEntity {
  public readonly hole: Hole;

  public sleepingHoleSprite;

  public availableHoleSprite;

  public blockedHoleSprite;

  public startHoleSprite;

  /**
   * @param {Hole} hole the hole to which this UI entity corresponds to
   */
  constructor(hole: Hole) {
    const settings = {
      height: 80,
      width: 80,
      id: `${AppConstants.HOLE_UI}-${hole.UID}`,
    };

    const xOffSet = 60;
    const newRowOffset = hole.id <= 7 ? 0 : 100;
    const x = (hole.id < 8 ? hole.id : 15 - hole.id) * 90 + xOffSet;
    const y = (hole.player.isOnTopSide() ? 100 : 330) + newRowOffset;
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
      image: me.loader.getImage(AppConstants.HOLE_SLEEPING_UI), //TODO instead of blocked make this sleeping
    });
    this.blockedHoleSprite = new me.Sprite(0, 0, {
      image: me.loader.getImage(AppConstants.HOLE_BLOCKED_UI), //TODO instead of blocked make this sleeping
    });
    this.startHoleSprite = new me.Sprite(0, 0, {
      image: me.loader.getImage(AppConstants.HOLE_START_UI), //TODO instead of blocked make this sleeping
    });

    this.sleepStateUI();
  }

  public sleepStateUI(): void {
    if (this.hole.availableMovesForCurrentPlayer().length > 0) {
      this.renderable = this.availableHoleSprite;
    } else {
      this.renderable = this.sleepingHoleSprite;
    }
  }

  drop(seedGroupUI: SeedGroupUI): void {
    console.info(`${seedGroupUI.id} dropped into ${this.id}`);
    // do not perform move if a drag and drop is performed on the same hole
    const startingHole = seedGroupUI.hole;
    if (startingHole.UID != this.hole.UID) {
      // only perform move only on destination holes that are adjacent from the starting hole
      const moveDirection = startingHole.adjacencyDirection(this.hole);
      if (moveDirection) {
        const move = new Move(startingHole, moveDirection);
        console.info(`UI requesting move:  \n\t: ${move}`);
        this.hole.board.executeMove(move);
      }
      //re-render all holes on board
      const board = this.hole.board;
      [board.topPlayer, board.bottomPlayer].forEach((player) => {
        for (const hole of player.boardHoles) {
          hole.ui.sleepStateUI();
        }
      });
    }
  }
}

export default HoleUI;
