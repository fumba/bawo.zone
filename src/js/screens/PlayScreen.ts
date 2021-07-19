import me from "../me";
import game from "../Game";
import HUD from "../ui_entities/HUD";
import Board from "../core/Board";
import SeedUI from "../ui_entities/SeedUI";
import SeedGroupUI from "../ui_entities/SeedGroupUI";
import UiHelper from "../ui_entities/UiHelper";
import UiTaskActions from "../core/UiTaskActions";
import Hole from "../core/Hole";
import AI from "../core/AI";
import Utility from "../Utility";

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
class PlayScreen extends me.Stage {
  private board: Board;

  onResetEvent(): void {
    //load a level
    //me.levelDirector.loadLevel("background");
    me.game.world.addChild(new me.ColorLayer("background", "#b7b6b5"), -1);

    // reset the score
    game.data.score = 0;

    this.board = new Board(me);

    console.info("Show play screen");

    // Add our HUD to the game world, add it last so that this is on top of the rest.
    // Can also be forced by specifying a "Infinity" z value to the addChild function.
    this.HUD = new HUD();
    me.game.world.addChild(this.HUD);

    const gameSpeed = 300;

    // CPU player should always be on the top side
    let isCpuTopPlayerTurn = Utility.getRandomInt(2) == 1 ? true : true;
    if (!isCpuTopPlayerTurn) {
      //go to bottom side of board for human player
      this.board.switchPlayers();
      // re-render all holes on board
      this.board.refreshUiState();
    }

    //update GUI elements state

    let refreshHoleSleepingState = false; //initially refresh state so that the initial seed arrangement is rendered
    me.timer.setInterval(() => {
      const task = this.board.uiTaskQueue.dequeue();
      if (task) {
        // refresh all holes status after the task is complete
        refreshHoleSleepingState = true;
        //initially set all hole UI as inactive during gameplay animation
        UiHelper.forEachBoardHole(this.board, (hole: Hole) => {
          hole.ui.label.setText(hole.ui.seedCount());
          hole.ui.renderable = hole.ui.sleepingHoleSprite;
          hole.seedGroupUI.renderable.tint.setColor(105, 105, 105);
        });
        switch (task.name) {
          case UiTaskActions.SOW_SEED_INTO_HOLE: {
            const seedGroupUI: SeedGroupUI = task.seedGroupUI as SeedGroupUI;
            console.info(`UI - Sowing seed into ${seedGroupUI.hole.UID}`);
            const seedUI: SeedUI = this.board
              .getCurrentPlayer()
              .ui.removeSeed(seedGroupUI);
            seedUI.group = seedGroupUI;
            seedUI.id = task.seedId;
            seedUI.randomisePosition();

            UiHelper.forEachUiSeedInHole(seedGroupUI.hole, (seedUI: SeedUI) => {
              seedUI.putOnTopOfContainer();
            });
            for (const seedUI of this.board.getCurrentPlayer().ui.seedsInHand) {
              seedUI.randomisePosition();
            }
            seedGroupUI.hole.ui.renderable =
              seedGroupUI.hole.ui.startHoleSprite;
            break;
          }
          case UiTaskActions.GRAB_ALL_SEEDS_FROM_HOLE: {
            const hole: Hole = task.hole as Hole;
            console.info(`UI - getting all seeds from hole ${hole.UID}`);
            //remove all ui seeds from hole
            UiHelper.forEachUiSeedInHole(hole, (seedUI: SeedUI) => {
              const currentPlayerHandUI = this.board.getCurrentPlayer();
              currentPlayerHandUI.ui.addSeed(seedUI);
              seedUI.group = null;
              seedUI.id = null;
              seedUI.randomisePosition();
            });
            hole.ui.renderable = hole.ui.startHoleSprite;
            break;
          }
        }
      } else {
        const draggingSeedGroup = UiHelper.getCurrentDraggingSeedGroup(me);
        if (!draggingSeedGroup && refreshHoleSleepingState == true) {
          // game is currently in sleep state (waiting for next player move)
          // re-render all holes on board
          this.board.refreshUiState();
          refreshHoleSleepingState = false;
          // switch to CPU player if its the top players turn
          isCpuTopPlayerTurn = this.board.getCurrentPlayer().isOnTopSide();
        }
      }
    }, gameSpeed);

    me.timer.setInterval(() => {
      if (isCpuTopPlayerTurn) {
        isCpuTopPlayerTurn = false;
        const move = AI.computeBestMove(this.board);
        this.board.executeMove(move);
      }
    }, gameSpeed);
  }

  onDestroyEvent(): void {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
  }
}

export default PlayScreen;
