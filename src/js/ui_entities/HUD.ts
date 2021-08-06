import Board from "../core/Board";
import me from "../me";

/**
 * a basic HUD (Heads Up Display) item to display score
 */

class HUD extends me.Renderable {
  private board: Board;
  public status: string;

  constructor(board: Board) {
    super(0, 0, 100, 100);
    this.board = board;

    this.font = new me.Text(0, 0, {
      font: "Arial",
      size: 15,
      fillStyle: this.color,
    });
    this.board.ui.addChild(this);
    this.status = this.board.getCurrentPlayer().toString();
  }

  draw(renderer: unknown): void {
    this.font.draw(
      renderer,
      this.status,
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2
    );
  }
}

export default HUD;
