import tmi from 'tmi.js';
import dotenv from 'dotenv';
dotenv.config()

import { BotCommand, MessageContext } from 'interfaces';
import ChatPlaysCommands from './commands/chatplays';
import FunCommands from './commands/fun';
import InfoCommands from './commands/info';
import ModCommands from './commands/mod';
import QueueCommands from './commands/queue';

const opts = {
  identity: {
    username: 'FiresBotZ',
    password: process.env.TWITCH_AUTH_TOKEN,
  },
  channels: [
    'FiresBZ'
  ],
};

const client = new tmi.client(opts);

const commands: {[cmdName: string]: BotCommand} = {
  ...ChatPlaysCommands,
  ...FunCommands,
  ...InfoCommands,
  ...ModCommands,
  ...QueueCommands,
};

client.on('message', (channel, user, message, self) => {
  if (self) return;
  const ctx: MessageContext = { client, channel, user, message, self };
  const [cmdName, ...args] = message.trim().split(' ');
  try {
    const cmd = commands[cmdName.toLowerCase()];
    cmd && cmd(ctx, ...args);
  } catch (err) {
    console.warn(`Message from ${user['display-name']} caused error: ${message}`);
    console.warn(`Error with ${cmdName}:`, err);
  }
});

client.on('connected', (address, port) => {
  console.log(`* Connected to ${address}:${port}`);
});

client.on('disconnected', (reason) => {
  console.log(`* Disconnected because ${reason}`);
});

client.connect()
