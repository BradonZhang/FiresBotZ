import { BotCommand } from 'interfaces';
import { isMod } from '../util';

let code = '';

const cmdPing: BotCommand = ({ client, channel }) => {
  client.say(channel, 'Pong!');
};

const cmdSetCode: BotCommand = ({ client, channel, user }, newCode = '') => {
  if (!isMod(user)) return;
  code = newCode;
  client.say(channel, code);
};

const cmdCode: BotCommand = ({ client, channel }) => {
  client.say(channel, code || 'No code is currently set.');
};

export default {
  '!ping': cmdPing,
  '!setcode': cmdSetCode,
  '!code': cmdCode,
};
