import me from "../me";
import game from "../Game";
import HUD from "../ui_entities/HUD";
import Board from "../core/Board";
import SeedUI from "../ui_entities/SeedUI";
import SeedGroupUI from "../ui_entities/SeedGroupUI";
import UiHelper from "../ui_entities/UiHelper";
import UiTaskActions from "../core/UiTaskActions";
import Hole from "../core/Hole";

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

    //update GUI elements state
    me.timer.setInterval(() => {
      const task = this.board.uiTaskQueue.dequeue();
      if (task) {
        //re-render all holes on board
        [this.board.topPlayer, this.board.bottomPlayer].forEach((player) => {
          for (const hole of player.boardHoles) {
            let count = 0;
            UiHelper.forEachUiSeedInHole(hole, () => {
              count++;
            });
            hole.ui.label.setText(count);
            hole.ui.renderable = hole.ui.sleepingHoleSprite;
          }
        });
        console.info(`UI - Recieved task : ${task.name}`);
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
              seedUI.pos.z = 0;
              me.game.world.sort(true);
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
        //re-render all holes on board
        if (!draggingSeedGroup) {
          [this.board.topPlayer, this.board.bottomPlayer].forEach((player) => {
            for (const hole of player.boardHoles) {
              hole.ui.label.setText(hole.toString());
              hole.ui.sleepStateUI();
            }
          });
        }
      }
    }, 500);
  }

  onDestroyEvent(): void {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
  }
}

export default PlayScreen;
