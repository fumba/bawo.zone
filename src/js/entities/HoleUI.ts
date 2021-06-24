/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Logger from "../../helpers/Logger";
import Hole from "../core/Hole";
import me from "../me";
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

/**
 * Bawo board seed
 */
class HoleUI extends me.DroptargetEntity {
  /**
   * @param {number} x  x coordinates of the hole object
   * @param {number} y  y coordinates of the hole object
   * @param {Hole} hole the hole to which this UI entity corresponds to
   */
  constructor(x: number, y: number, hole: Hole) {
    const settings = {
      image: me.loader.getImage("hole"),
      height: 80,
      width: 80,
      id: `hole-${hole.UID}`,
    };
    super(x, y, settings);
  }

  drop(draggableEntity: SeedUI): void {
    Logger.info(`${draggableEntity.id} dropped into ${this.id}`, HoleUI.name);
  }
}

export default HoleUI;