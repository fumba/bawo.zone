/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AppConstants from "../core/AppConstants";
import Hole from "../core/Hole";
import me from "../me";
import SeedGroupUI from "./SeedGroupUI";

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
      image: me.loader.getImage(AppConstants.HOLE_UI),
      height: 80,
      width: 80,
      id: HoleUI.holeId(hole),
    };
    super(x, y, settings);
    // overlaps are not valid drops
    // draggable seed container UI (SeedGroupUI) has a smaller radius so all drops are expected
    // to be contained within the hole radius.
    this.setCheckMethod(this.CHECKMETHOD_CONTAINS);
  }

  drop(draggableEntity: SeedGroupUI): void {
    console.info(`${draggableEntity.id} dropped into ${this.id}`);
  }

  public static holeId(hole: Hole) {
    return `${AppConstants.HOLE_UI}-${hole.UID}`;
  }
}

export default HoleUI;
