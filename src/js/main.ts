declare let require: any;
require('../css/main.css');
import me from './me';
import PlayerEntity from './entities/player';
import PlayScreen from './screens/play';
import TitleScreen from './screens/title';

class Bootstrap {
    constructor() {
        // Initialize the video.
        if (!me.video.init(960, 640, { wrapper: 'screen', scale: 'flex-width', renderer: me.video.CANVAS })) {
            alert('Your browser does not support HTML5 canvas.');
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === '#debug') {
            console.log('show debug');
            window.addEventListener('load', () => {
                me.plugin.register.defer(this, me.debug.Panel, 'debug', me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init('mp3,ogg');

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload({});

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    }

    loaded() {
        me.state.set(me.state.MENU, new TitleScreen());
        me.state.set(me.state.PLAY, new PlayScreen());

        // add our player entity in the entity pool
        me.pool.register('mainPlayer', PlayerEntity);

        // Start the game.
        me.state.change(me.state.PLAY);
    }

    static boot() {
        const bootstrap = new Bootstrap();

        // Mobile browser hacks
        if (me.device.isMobile) {
            // Prevent the webview from moving on a swipe
            window.document.addEventListener(
                'touchmove',
                function (e) {
                    e.preventDefault();
                    window.scroll(0, 0);
                    return false;
                },
                false,
            );

            me.event.subscribe(me.event.WINDOW_ONRESIZE, () => {
                window.scrollTo(0, 1);
            });
        }

        return bootstrap;
    }
}

window.addEventListener('load', () => {
    Bootstrap.boot();
});
