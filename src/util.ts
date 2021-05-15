import tmi from 'tmi.js';

export const isMod = (user: tmi.Userstate) => user.mod || user['user-id'] === user['room-id'];
