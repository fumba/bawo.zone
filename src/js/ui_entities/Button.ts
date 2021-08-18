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
class Button extends me.GUI_Object {
  constructor(
    x: number,
    y: number,
    color: string,
    label: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function
  ) {
    super(x, y, {
      image: color + "_button04",
    });

    // offset of the two used images in the texture
    this.unclicked_region = color + "_button04";
    this.clicked_region = color + "_button05";
    this.callback = callback;

    this.anchorPoint.set(0, 0);
    this.setOpacity(0.5);

    this.font = new me.Text(0, 0, {
      font: "Arial",
      size: 12,
      fillStyle: "black",
      textAlign: "center",
      textBaseline: "middle",
    });

    this.label = label;
  }

  /**
   * function called when the pointer is over the object
   */
  onOver(/* event */): void {
    this.setOpacity(1.0);
  }

  /**
   * function called when the pointer is leaving the object area
   */
  onOut(/* event */): void {
    this.setOpacity(0.5);
  }

  /**
   *function called when the object is clicked on
   *
   * @returns {boolean} false - event not propagated
   */
  onClick(/* event */): boolean {
    this.callback();
    return false;
  }

  draw(renderer: unknown): void {
    this._super(me.GUI_Object, "draw", [renderer]);
    this.font.draw(
      renderer,
      this.label,
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2
    );
  }
}

export default Button;
