import me from "../me";
import game from "../Game";
import Board from "../core/Board";
import SeedUI from "../ui_entities/SeedUI";
import SeedGroupUI from "../ui_entities/SeedGroupUI";
import UiHelper from "../ui_entities/UiHelper";
import UiTaskActions from "../core/UiTaskActions";
import Hole from "../core/Hole";
import AI from "../core/AI";
import Utility from "../Utility";
import BoardUiState from "../core/BoardUiState";
import AppConstants from "../core/AppConstants";
import Button from "../ui_entities/Button";
import YokhomaModeRules from "../core/rules/YokhomaModeRules";
import MtajiModeRules from "../core/rules/MtajiModeRules";

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
    this.colorLayer = new me.ColorLayer("background", "#b7b6b5");
    me.game.world.addChild(this.colorLayer, -1);

    // Add our HUD to the game world, add it last so that this is on top of the rest.
    // Can also be forced by specifying a "Infinity" z value to the addChild function.
    this.board = new Board(me, new MtajiModeRules());

    const yamtajiModeBtn = new Button(50, 50, "yellow", "Yamtaji", () => {
      this.board.ui.reset();
      this.board = new Board(me, new MtajiModeRules());
    });
    me.game.world.addChild(yamtajiModeBtn);

    const yokhomaModeBtn = new Button(300, 50, "yellow", "Yokhoma", () => {
      this.board.ui.reset();
      this.board = new Board(me, new YokhomaModeRules());
    });
    me.game.world.addChild(yokhomaModeBtn);

    const gameSpeed = 300;

    const humanVsHuman = false;
    const computerVsHuman = true;
    // CPU player should always be on the top side
    let isCpuTopPlayerTurn = Utility.getRandomInt(2) == 1 ? false : true;
    let isCpuBottomPlayerTurn = !computerVsHuman && !isCpuTopPlayerTurn;

    if (!humanVsHuman && !isCpuTopPlayerTurn && computerVsHuman) {
      //go to bottom side of board for human player
      this.board.switchPlayers();
      // re-render all holes on board
      this.board.draw(BoardUiState.RESTING);
    }

    //update GUI elements state

    let refreshHoleSleepingState = false; //initially refresh state so that the initial seed arrangement is rendered
    const intervalId = me.timer.setInterval(() => {
      const task = this.board.uiTaskQueue.dequeue();
      if (task) {
        // refresh all holes status after the task is complete
        refreshHoleSleepingState = true;
        //initially set all hole UI as inactive during game play animation
        this.board.draw(BoardUiState.PLAY_IN_PROGRESS);
        this.board.HUD.status = "play in progress...";

        switch (task.name) {
          case UiTaskActions.SOW_SEED_INTO_HOLE: {
            const seedGroupUI: SeedGroupUI = task.seedGroupUI as SeedGroupUI;
            console.info(`UI - Sowing seed into ${seedGroupUI.hole.UID}`);
            me.audio.play(AppConstants.SOW_NORMAL_SOUND_1);
            const seedUI: SeedUI = this.board
              .getCurrentPlayer()
              .ui.removeSeed(seedGroupUI);
            seedUI.group = seedGroupUI;
            seedUI.id = task.seedId;
            seedUI.randomizePosition();

            UiHelper.forEachUiSeedInHole(seedGroupUI.hole, (seedUI: SeedUI) => {
              seedUI.putOnTopOfContainer();
            });
            for (const seedUI of this.board.getCurrentPlayer().ui.seedsInHand) {
              seedUI.randomizePosition();
            }
            seedGroupUI.hole.ui.renderable =
              seedGroupUI.hole.ui.startHoleSprite;
            break;
          }
          case UiTaskActions.GRAB_ALL_SEEDS_FROM_HOLE: {
            const hole: Hole = task.hole as Hole;
            const isCapture: boolean = task.isCapture as boolean;
            console.info(`UI - getting all seeds from hole ${hole.UID}`);
            isCapture
              ? me.audio.play(AppConstants.SEED_STEAL)
              : me.audio.play(AppConstants.SEED_GRAB);
            //remove all ui seeds from hole
            UiHelper.forEachUiSeedInHole(hole, (seedUI: SeedUI) => {
              const currentPlayerHandUI = this.board.getCurrentPlayer();
              currentPlayerHandUI.ui.addSeed(seedUI);
              seedUI.group = null;
              seedUI.id = null;
              seedUI.randomizePosition();
            });
            hole.ui.renderable = hole.ui.startHoleSprite;
            break;
          }
        }
      } else {
        //check if game is over
        if (this.board.isGameOver()) {
          this.board.HUD.status = "Game Over!!!";
          me.timer.clearInterval(intervalId);
          return;
        }
        const draggingSeedGroup = UiHelper.getCurrentDraggingSeedGroup(me);
        if (!draggingSeedGroup && refreshHoleSleepingState == true) {
          refreshHoleSleepingState = false;
          me.audio.play(AppConstants.MOVE_END);

          Utility.sleep(gameSpeed).then(() => {
            // game is currently in sleep state (waiting for next player move)
            // re-render all holes on board
            this.board.draw(BoardUiState.RESTING);
            this.board.HUD.status = "Waiting for next player...";
            // switch to CPU player if its the top players turn
            isCpuTopPlayerTurn = this.board.getCurrentPlayer().isOnTopSide();
            isCpuBottomPlayerTurn = !computerVsHuman && !isCpuTopPlayerTurn;
          });
        }
      }

      // computer player makes move
      if (!humanVsHuman) {
        if (isCpuTopPlayerTurn) {
          isCpuTopPlayerTurn = false;
          const move = AI.computeBestMove(this.board);
          console.info("TOP CPU-AI BEST MOVE", move);
          this.board.executeMove(move);
        }
        if (isCpuBottomPlayerTurn) {
          isCpuBottomPlayerTurn = false;
          const move = AI.computeBestMove(this.board);
          console.info("BOTTOM CPU-AI BEST MOVE", move);
          this.board.executeMove(move);
        }
      }
    }, gameSpeed);
  }

  onDestroyEvent(): void {
    // remove the HUD from the game world
    me.game.world.removeChild(this.board.ui);
  }
}

export default PlayScreen;
