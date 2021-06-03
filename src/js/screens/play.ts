import me from '../me';
import game from '../game';
import HUD from '../entities/HUD';

class PlayScreen extends me.Stage {
    onResetEvent() {
        // reset the score
        game.data.score = 0;

        console.log('Show play screen');

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new HUD();
        me.game.world.addChild(this.HUD);
    }

    onDestroyEvent() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
}

export default PlayScreen;
