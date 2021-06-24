import me from "../me";
import game from "../Game";
import HUD from "../entities/HUD";
import Board from "../core/Board";

class PlayScreen extends me.Stage {
  private board: Board;

  onResetEvent(): void {
    //load a level
    //me.levelDirector.loadLevel("background");
    me.game.world.addChild(new me.ColorLayer("background", "#B7B6B5"), -1);

    // reset the score
    game.data.score = 0;

    this.board = new Board(me);
    //TODO testing only
    //this.board.runSimulation(false);

    console.info("Show play screen");

    // Add our HUD to the game world, add it last so that this is on top of the rest.
    // Can also be forced by specifying a "Infinity" z value to the addChild function.
    this.HUD = new HUD();
    me.game.world.addChild(this.HUD);
  }

  onDestroyEvent(): void {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
  }
}

export default PlayScreen;
