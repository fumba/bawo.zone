import Board from "../core/Board";
import MtajiModeRules from "../core/rules/MtajiModeRules";
import YokhomaModeRules from "../core/rules/YokhomaModeRules";
import me from "../me";
import Button from "../ui_entities/Button";
import PlayScreen from "./PlayScreen";

class TitleScreen extends me.Stage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private betaLabel: any;
  private yamtajiModeBtn: Button;
  private yokhomaModeBtn: Button;
  /**
   *  action to perform on state change
   */
  onResetEvent(): void {
    me.game.world.addChild(new me.ColorLayer("background", "#b7b6b5"), -1);

    this.betaLabel = new me.Text(100, 100, {
      font: "Arial",
      size: 15,
      fillStyle: "#8B0000",
    });
    this.betaLabel.setText(
      `This game is under development by Fumba Game Labs - this is an unfinished developers build. 
      \nPlease check www.bawo.zone for development updates.
      \n\n\nfumba.me@gmail.com - August 2021`
    );
    me.game.world.addChild(this.betaLabel);

    this.yamtajiModeBtn = new Button(50, 250, "yellow", "Yamtaji", () => {
      const board = new Board(me, new MtajiModeRules());
      me.state.set(me.state.PLAY, new PlayScreen(board));
      me.state.change(me.state.PLAY);
    });
    me.game.world.addChild(this.yamtajiModeBtn);

    this.yokhomaModeBtn = new Button(300, 250, "yellow", "Yokhoma", () => {
      const board = new Board(me, new YokhomaModeRules());
      me.state.set(me.state.PLAY, new PlayScreen(board));
      me.state.change(me.state.PLAY);
    });
    me.game.world.addChild(this.yokhomaModeBtn);
  }

  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent(): void {
    me.game.world.removeChild(this.yamtajiModeBtn);
    me.game.world.removeChild(this.yokhomaModeBtn);
  }
}

export default TitleScreen;
