/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AppConstants from "../core/AppConstants";
import Hole from "../core/Hole";
import me from "../me";

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
class SeedUI extends me.Entity {
  /**
   *
   * @param {number} x  x coordinates of the seed object
   * @param {number} y  y coordinates of the seed object
   * @param {Hole} hole the hole in which this seed currently belongs
   */
  constructor(x: number, y: number, hole: Hole) {
    const settings = {
      image: me.loader.getImage(AppConstants.SEED_UI),
      height: 25,
      width: 25,
      id: SeedUI.seedGroupId(hole),
    };
    super(x, y, settings);
  }

  public static seedGroupId(hole: Hole) {
    return `${AppConstants.SEED_UI}-${hole.UID}`;
  }
}

export default SeedUI;
