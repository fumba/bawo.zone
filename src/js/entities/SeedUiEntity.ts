/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Logger from "../../helpers/Logger";
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

class SeedUiEntity extends me.DraggableEntity {
  constructor(id: number, x: number, y: number) {
    const settings = {
      image: me.loader.getImage("seed"),
      height: 25,
      width: 25,
      id: id,
    };
    super(x, y, settings);
    Logger.info("seed", SeedUiEntity.name);
  }

  dragStart(event: any): void {
    console.log(this.id, event.gameX);
    super.dragStart(event);
  }
}

export default SeedUiEntity;
