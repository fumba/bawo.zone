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

import AppConstants from "../src/js/core/AppConstants";

class TestHelper {
  public static disableLogging(): void {
    //disable console log when running tests
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.info = () => {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static mockGetChildByType(type: any): Array<unknown> {
    switch (type.name.toString()) {
      case "SeedUI": {
        const seeds = [];
        for (let i = 0; i < AppConstants.MAX_SEED_COUNT; i++) {
          seeds.push("seed"); //TODO
        }
        return seeds;
      }
      default:
        return [];
    }
  }

  public static mockSeedUI = {
    randomisePosition: jest.fn().mockReturnThis(),
  };

  public static mockPlayerUI = {
    removeSeed: jest.fn().mockReturnValue(TestHelper.mockSeedUI),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static mockPoolPull(name: string): any {
    switch (name) {
      case AppConstants.SEED_UI: {
        return "seed"; //TODO
      }
      case AppConstants.HOLE_UI: {
        return "hole"; //TODO
      }
      case AppConstants.PLAYER_UI: {
        return TestHelper.mockPlayerUI;
      }
      default:
        return null;
    }
  }

  public static me = {
    game: {
      world: {
        addChild: jest.fn().mockReturnThis(),
        getChild: jest.fn().mockReturnThis(),
        getChildByType: jest
          .fn()
          .mockImplementation((type) => TestHelper.mockGetChildByType(type)),
      },
    },
    pool: {
      pull: jest
        .fn()
        .mockImplementation((name) => TestHelper.mockPoolPull(name)),
    },
  };
}

export default TestHelper;
