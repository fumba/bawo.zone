import me from "../me";
import Utility from "../Utility";

class TitleScreen extends me.Stage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private betaLabel: any;
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
      \n\n\nfumba.me@gmail.com - July 2021`
    );
    me.game.world.addChild(this.betaLabel);

    Utility.sleep(1000).then(() => {
      me.state.change(me.state.PLAY);
    });
  }

  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent(): void {
    // TODO
  }
}

export default TitleScreen;
