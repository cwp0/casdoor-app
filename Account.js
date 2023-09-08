// Copyright 2023 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


import {default as hotptotp} from 'hotp-totp';
const {totp} = hotptotp;
window.Buffer = window.Buffer || require("buffer").Buffer;

class Account {
  constructor(description, secretCode, onUpdate) {
    this.title = description;
    this.secretCode = secretCode;
    this.countdowns = 30;
    this.timer = setInterval(this.updateCountdown.bind(this), 1000);
    this.token = '';
    this.tokenInterval = setInterval(this.generateAndSetToken.bind(this), 30000);
    this.onUpdate = onUpdate;
  }

  generateToken = async () => {
    let token = await totp(this.secretCode);
    return token;
  }

  generateAndSetToken = async () => {
    this.token = await this.generateToken();
    this.onUpdate();
  }

  updateCountdown() {
    this.countdowns = Math.max(0, this.countdowns - 1);
    if (this.countdowns === 0) {
      this.countdowns = 30;
      this.onUpdate();
    }
  }
}

export default Account;