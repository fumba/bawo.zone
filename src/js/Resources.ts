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
    {
      name: AppConstants.HOLE_START_UI,
      type: "image",
      src: "data/img/hole_start.png",
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
  //hand
  private static hand: Array<Record<string, unknown>> = [
    {
      name: AppConstants.PLAYER_UI,
      type: "image",
      src: "data/img/hand.png",
    },
  ];
  // audio clips
  private static sounds: Array<Record<string, unknown>> = [
    { name: AppConstants.SOW_NORMAL_SOUND_1, type: "audio", src: "data/sfx/" },
    { name: AppConstants.MOVE_END, type: "audio", src: "data/sfx/" },
    { name: AppConstants.SEED_GRAB, type: "audio", src: "data/sfx/" },
    { name: AppConstants.SEED_STEAL, type: "audio", src: "data/sfx/" },
  ];
  //buttons
  private static buttons: Array<Record<string, unknown>> = [
    {
      name: "yellow_button04",
      type: "image",
      src: "data/img/yellow_button04.png",
    },
    {
      name: "yellow_button05",
      type: "image",
      src: "data/img/yellow_button05.png",
    },
  ];

  public static assets: Array<Record<string, unknown>> = [
    ...Resources.seedImage,
    ...Resources.holeImage,
    ...Resources.seedCollection,
    ...Resources.hand,
    ...Resources.sounds,
    ...Resources.buttons,
  ];
}

export default Resources;
