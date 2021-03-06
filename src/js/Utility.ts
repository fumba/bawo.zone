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

import Vector from "../js/core/Vector";

class Utility {
  /**
   * Adds zero to a number that is less than 9
   *
   * @param {number} num number representing hole ID
   * @returns {string} the number after being padded or not
   */

  public static padZero(num: number): string {
    const str = num.toString();
    return str.length < 2 ? "0".concat(str) : str;
  }

  /**
   * Generates a random point in a circle using polar notation.
   * This implementation adopted from https://dev.to/seanpgallivan/solution-generate-random-point-in-a-circle-ldh#idea
   *
   * @param {number} radius the radius of the circle
   * @param {number} xCenter center x coordinate value
   * @param {number} yCenter center y coordinate value
   * @returns {Vector} randomly generated (x,y) coordinates
   */
  public static randomPointWithinCircle(
    radius: number,
    xCenter: number,
    yCenter: number
  ): Vector {
    const angle = Math.random() * 2 * Math.PI;
    const hypotenuse = Math.sqrt(Math.random()) * radius;
    const adjacent = Math.cos(angle) * hypotenuse;
    const opposite = Math.sin(angle) * hypotenuse;
    return new Vector(xCenter + adjacent, yCenter + opposite, 0);
  }

  /**
   * Generates a random integer that is less than the specified max
   *
   * @param {number} max the maximum limit of the generated integer
   * @returns {number} a random generated number
   */
  public static getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Sleep function
   *
   * @param {number} ms  time in milliseconds to pause code execution
   * @returns {Promise<void>} void
   */
  public static sleep(ms: number): Promise<void> {
    console.info(`Sleeping for ${ms} ms`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default Utility;
