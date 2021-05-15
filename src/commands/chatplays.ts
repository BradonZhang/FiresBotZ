import tmi from 'tmi.js';
import robot from 'robotjs';

import { BotCommand } from 'interfaces';
import { isMod } from '../util';
import { join } from 'path';

robot.setKeyboardDelay(1000 / 60);
let robotEnabled = false;

const cmdPress = (key: string) => (({ user, message }) => {
  if (!robotEnabled && isMod(user)) return;
  console.log(`  ${message.split(' ')[0]}\t(${user['display-name']})`);
  robot.keyTap(key);
}) as BotCommand;

const cmdToggleTwitchPlays: BotCommand = ({ client, channel, user }) => {
  robotEnabled = !robotEnabled;
  client.say(channel, `Twitch Plays functionality is now ${robotEnabled ? 'ON' : 'OFF'}.`);
};

const cmdTwitchPlaysTetrio: BotCommand = ({ client, channel }) => {
  client.say(channel, `!l, !r, !ccw, !cw, !180, !sd, !hd, !hold`);
};

export default {
  '!toggletpt': cmdToggleTwitchPlays,
  '!tpt': cmdTwitchPlaysTetrio,
  '!l': cmdPress('a'),
  '!left': cmdPress('a'),
  '!r': cmdPress('d'),
  '!right': cmdPress('d'),
  '!ccw': cmdPress('j'),
  '!180': cmdPress('k'),
  '!cw': cmdPress('l'),
  '!sd': cmdPress('s'),
  '!soft': cmdPress('s'),
  '!d': cmdPress('s'),
  '!down': cmdPress('s'),
  '!hd': cmdPress(' '),
  '!hard': cmdPress(' '),
  '!drop': cmdPress(' '),
  '!hold': cmdPress(';'),
};
