import tmi from 'tmi.js';

import { BotCommand } from 'interfaces';
import { isMod } from '../util';
import { join } from 'path';

let queueClosed = false;
const queue: Array<tmi.ChatUserstate> = [];
const joined = new Set<string>();

const cmdQueue: BotCommand = ({ client, channel }) => {
  const userList = queue.map(user => user['display-name']).join(', ');
  if (queue.length) client.say(channel, `Current queue (${queue.length}): ${userList}`);
  else client.say(channel, 'The queue is currently empty.');
};

const cmdJoin: BotCommand = ({ client, channel, user }) => {
  if (queueClosed) return client.say(channel, 'The queue is currently closed.');
  const userId = user['user-id']!;
  if (joined.has(userId)) {
    client.say(channel, `${user['display-name']}, you are already in the queue.`);
  } else {
    queue.push(user);
    joined.add(userId);
    client.say(channel, `${user['display-name']} is now in the queue! (Position #${queue.length})`);
  }
};

const cmdNext: BotCommand = ({ client, channel }) => {
  // TODO: Add option to view k next people
  if (queue.length) client.say(channel, `${queue[0]['display-name']} is next in the queue.`);
  else client.say(channel, 'The queue is currently empty.');
};

const cmdLeave: BotCommand = ({ client, channel, user }) => {
  const userId = user['user-id'];
  const index = queue.findIndex(user => user['user-id'] === userId);
  if (index < 0) {
    client.say(channel, `${user['display-name']}, you are not currently in the queue.`)
  } else {
    queue.splice(index, 1);
    joined.delete(userId!);
    client.say(channel, `${user['display-name']} has been removed from the queue.`)
  }
};

const cmdDequeue: BotCommand = ({ client, channel, user }, numPoppedStr = '1') => {
  if (!isMod(user)) return;
  // TODO: Optimize, current operation is O(n*k) when it should be O(k)
  const numPopped = Math.min(Number(numPoppedStr) || 0, queue.length);
  for (let i = 0; i < numPopped; ++i) joined.delete(queue.shift()!['user-id']!);
  client.say(channel, `Removed first ${numPopped} user(s) from the queue.`);
};

const cmdCloseQueue: BotCommand = ({ client, channel, user }) => {
  if (!isMod(user)) return;
  queueClosed = true;
  client.say(channel, 'The queue is now closed, and no new users can join.');
};

const cmdOpenQueue: BotCommand = ({ client, channel, user }) => {
  if (!isMod(user)) return;
  queueClosed = false;
  client.say(channel, 'The queue is now open! Use !join to join the queue.');
};

// TODO: Implement command to manually add someone into the queue
const cmdAdd: BotCommand = () => {};

// TODO: Implement command to manually remove someone from the queue
const cmdRemove: BotCommand = (ctx, displayName = '') => {
  const { client, channel, user } = ctx;
  if (!isMod(user)) return;
  if (!displayName) return cmdDequeue(ctx);
  const userId = user['user-id'];
  const index = queue.findIndex(user => user['user-id'] === userId);
  if (index < 0) {
    client.say(channel, `${user['display-name']} is not currently in the queue.`)
  } else {
    queue.splice(index, 1);
    joined.delete(userId!);
    client.say(channel, `${user['display-name']} has been removed from the queue.`)
  }
};

export default {
  '!q': cmdQueue,
  '!queue': cmdQueue,
  '!join': cmdJoin,
  '!next': cmdNext,
  '!leave': cmdLeave,
  '!remove': cmdRemove,
  '!dequeue': cmdDequeue,
  '!closequeue': cmdCloseQueue,
  '!openqueue': cmdOpenQueue,
};
