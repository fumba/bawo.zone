import me from "../me";
import game from "../Game";
import HUD from "../ui_entities/HUD";
import Board from "../core/Board";
import SeedUI from "../ui_entities/SeedUI";
import SeedGroupUI from "../ui_entities/SeedGroupUI";
import UiHelper from "../ui_entities/UiHelper";
import UiTaskActions from "../core/UiTaskActions";
import Hole from "../core/Hole";
import Utility from "../Utility";
import Move from "../core/Move";

class PlayScreen extends me.Stage {
  private board: Board;

  onResetEvent(): void {
    //load a level
    //me.levelDirector.loadLevel("background");
    me.game.world.addChild(new me.ColorLayer("background", "#B7B6B5"), -1);

    // reset the score
    game.data.score = 0;

    this.board = new Board(me);

    console.info("Show play screen");

    // Add our HUD to the game world, add it last so that this is on top of the rest.
    // Can also be forced by specifying a "Infinity" z value to the addChild function.
    this.HUD = new HUD();
    me.game.world.addChild(this.HUD);

    const gameSpeed = 300;
    let isCpuTurn = false;

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
          // re-render all holes on board
          UiHelper.forEachBoardHole(this.board, (hole: Hole) => {
            hole.ui.label.setText(hole.ui.seedCount());
            hole.ui.sleepStateUI();
            hole.seedGroupUI.updateContainerStatus();
          });
          refreshHoleSleepingState = false;

          // ui and non-ui game board should always be in sync
          this.validateUiState();
          isCpuTurn = !this.board.getCurrentPlayer().isOnTopSide();
        }
      }
    }, gameSpeed);

    me.timer.setInterval(() => {
      if (isCpuTurn) {
        isCpuTurn = false;
        const moves: Array<Move> = this.board.getAllAvailableValidMoves(
          this.board.getCurrentPlayer()
        );
        const move = moves[Utility.getRandomInt(moves.length)];
        this.board.executeMove(move);
      }
    }, 100);
  }

  public validateUiState(): void {
    UiHelper.forEachBoardHole(this.board, (hole: Hole) => {
      if (hole.numSeeds != hole.ui.seedCount()) {
        throw new Error(
          `UI (${hole.ui.seedCount()}) and non-UI (${
            hole.numSeeds
          }) board not in sync : ${hole.toString()}`
        );
      }
    });
  }

  onDestroyEvent(): void {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
  }
}

export default PlayScreen;
