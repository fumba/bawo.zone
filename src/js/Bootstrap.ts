/* eslint-disable @typescript-eslint/no-explicit-any */
declare let require: any;
require("../css/main.css");
import me from "./me";
import TitleScreen from "./screens/TitleScreen";
import SeedUI from "./ui_entities/SeedUI";
import HoleUI from "./ui_entities/HoleUI";
import SeedGroupUI from "./ui_entities/SeedGroupUI";
import AppConstants from "./core/AppConstants";
import PlayerUI from "./ui_entities/PlayerUI";
import Resources from "./Resources";

class Bootstrap {
  constructor() {
    // Initialize the video.
    if (
      !me.video.init(1024, 600, {
        parent: "screen",
        scale: "flex",
        renderer: me.video.CANVAS,
      })
    ) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
      console.info("DEBUG mode ON");
      window.addEventListener("load", () => {
        me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
      });
    } else {
      // disable info-logs unless in debug mode
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      console.info = () => {};
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");
    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);
    // Load the resources.
    me.loader.preload(Resources.assets);
    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  }

  loaded() {
    me.state.set(me.state.MENU, new TitleScreen());

    // Register game UI entities
    me.pool.register(AppConstants.SEED_UI, SeedUI);
    me.pool.register(AppConstants.HOLE_UI, HoleUI);
    me.pool.register(AppConstants.SEED_GROUP_UI, SeedGroupUI);
    me.pool.register(AppConstants.PLAYER_UI, PlayerUI);

    // Start the game.
    me.state.change(me.state.MENU);
  }

  static boot() {
    const bootstrap = new Bootstrap();

    // Mobile browser hacks
    if (me.device.isMobile) {
      // Prevent the webview from moving on a swipe
      window.document.addEventListener(
        "touchmove",
        function (e) {
          e.preventDefault();
          window.scroll(0, 0);
          return false;
        },
        false
      );

      me.event.subscribe(me.event.WINDOW_ONRESIZE, () => {
        window.scrollTo(0, 1);
      });
    }

    return bootstrap;
  }
}

window.addEventListener("load", () => {
  Bootstrap.boot();
});
