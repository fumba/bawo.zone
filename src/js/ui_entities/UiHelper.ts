import { CANCELLED } from "dns";
import Board from "../core/Board";
import Hole from "../core/Hole";
import HoleUI from "./HoleUI";
import SeedGroupUI from "./SeedGroupUI";
import SeedUI from "./SeedUI";

/*
 * bawo.zone - <a href="https://bawo.zone">https://bawo.zone</a>
 * <a href="https://github.com/fumba/bawo.zone">https://github.com/fumba/bawo.zone</a>
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* istanbul ignore next */
class UiHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static forEachUiHole(callback: CallableFunction, me: any): void {
    const allHoles: Array<HoleUI> = me.game.world.getChildByType(HoleUI);
    allHoles.forEach((hole: HoleUI) => callback(hole));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static getCurrentDraggingSeedGroup(me: any): SeedGroupUI {
    const all: Array<SeedGroupUI> = me.game.world.getChildByType(SeedGroupUI);
    return all.filter((group: SeedGroupUI) => group.dragging)[0];
  }

  public static forEachUiSeedInHole(
    hole: Hole,
    callback: CallableFunction
  ): void {
    const seeds: Array<SeedUI> = hole.board.me.game.world.getChildByProp(
      "id",
      SeedUI.seedGroupId(hole.UID)
    );
    seeds.forEach((seed) => callback(seed));
  }

  public static forEachBoardHole(
    board: Board,
    callback: CallableFunction
  ): void {
    [board.topPlayer, board.bottomPlayer].forEach((player) => {
      for (const hole of player.boardHoles) {
        callback(hole);
      }
      if (board.rules.hasHomeHole()) {
        callback(player.boardHoles.nyumba);
      }
    });
  }
}

export default UiHelper;
