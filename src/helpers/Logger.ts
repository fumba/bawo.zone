/**
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require("util");

import * as chalk from "chalk";

import { isEmpty } from "lodash";

class Logger {
  /**
   *
   * @returns {boolean} indicating whether or not logs should be printed
   */
  private static showLog(): boolean {
    let check = true;
    if (typeof document != "undefined") {
      check =
        document.location.hash === "#debug" ||
        document.location.origin === "file://";
    }
    return check;
  }

  /**
   *
   * @param {string} message message to be logged
   * @param {string} className the name of the class logging the message
   */
  public static info(message: string, className: string): void {
    message = `[INFO] ${className} - ${message}`;
    if (this.showLog()) {
      console.log(chalk.blue(message));
    }
    if (!isEmpty(fs)) {
      const log = fs.createWriteStream("bawo.log", { flags: "a" });
      log.write(util.format(message) + "\n");
    }
  }
}

export default Logger;
