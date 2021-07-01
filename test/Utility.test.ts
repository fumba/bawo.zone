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

import Utility from "../src/js/Utility";

describe("#padZero", () => {
  test("should try to add zero to a number that is less than 9", () => {
    expect(Utility.padZero(2)).toBe("02");
    expect(Utility.padZero(0)).toBe("00");
    expect(Utility.padZero(9)).toBe("09");
  });

  test("should try not to add a zero if a number is not more than 9", () => {
    expect(Utility.padZero(10)).toBe("10");
    expect(Utility.padZero(15)).toBe("15");
  });
});

describe("#randomPointWithinCircle", () => {
  test("should generate random points within a circle of given radius", () => {
    // generate 50 random points and make sure that each is within the bounds.
    // in this case, x and y points should range within radius and -radius
    for (let radius = 1; radius < 50; radius++) {
      const points = Utility.randomPointWithinCircle(radius, 0, 0);
      //check x coordinate
      expect(points.x).toBeLessThan(radius);
      expect(points.x).toBeGreaterThan(-radius);
      //check y coordinate
      expect(points.y).toBeLessThan(radius);
      expect(points.y).toBeGreaterThan(-radius);
    }
  });
});

describe("#getRandomInt", () => {
  test("should generate a random integer less than the specified max", () => {
    for (let i = 0; i < 20; i++) {
      expect(Utility.getRandomInt(5)).toBeLessThan(5);
    }
  });
});
