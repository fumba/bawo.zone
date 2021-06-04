/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { app } from "electron";

export default {
  label: "App",
  submenu: [
    {
      label: "Quit",
      accelerator: "CmdOrCtrl+Q",
      click: () => {
        app.quit();
      },
    },
  ],
};
