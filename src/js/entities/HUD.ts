import game from "../Game";
import me from "../me";

/**
 * a basic HUD (Heads Up Display) item to display score
 */
class ScoreItem extends me.Renderable {
  constructor(x: number, y: number) {
    super(x, y, 10, 10);
    console.info("Show HUD");
    this.score = -1;
  }

  update() {
    // we don't do anything fancy here, so just
    // return true if the score has been updated

    if (this.score !== game.data.score) {
      this.score = game.data.score;
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw(context: unknown) {
    // draw it baby !
  }
}

class HUD extends me.Container {
  constructor() {
    super();
    // persistent across level change
    this.isPersistent = true;

    // make sure we use screen coordinates
    this.floating = true;

    // give a name
    this.name = "HUD";

    // add our child score object at the top left corner
    this.addChild(new ScoreItem(5, 5));
  }
}

export default HUD;
