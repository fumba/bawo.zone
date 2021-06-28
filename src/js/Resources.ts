import AppConstants from "./core/AppConstants";

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
class Resources {
  //game board background image
  private static backgroundImage: Array<Record<string, unknown>> = [
    { name: "background", type: "image", src: "data/img/background.jpeg" },
    { name: "background", type: "tmx", src: "data/map/background.tmx" },
  ];
  //seed
  private static seedImage: Array<Record<string, unknown>> = [
    { name: AppConstants.SEED_UI, type: "image", src: "data/img/seed.png" },
  ];
  //hole
  private static holeImage: Array<Record<string, unknown>> = [
    {
      name: AppConstants.HOLE_SLEEPING_UI,
      type: "image",
      src: "data/img/hole_sleeping.png",
    },
    {
      name: AppConstants.HOLE_AVAILABLE_UI,
      type: "image",
      src: "data/img/hole_available.png",
    },
    {
      name: AppConstants.HOLE_BLOCKED_UI,
      type: "image",
      src: "data/img/hole_blocked.png",
    },
  ];
  //seed-collection
  private static seedCollection: Array<Record<string, unknown>> = [
    {
      name: AppConstants.SEED_GROUP_UI,
      type: "image",
      src: "data/img/seed-collection.png",
    },
  ];

  public static assets: Array<Record<string, unknown>> = [
    ...Resources.backgroundImage,
    ...Resources.seedImage,
    ...Resources.holeImage,
    ...Resources.seedCollection,
  ];
}

export default Resources;
