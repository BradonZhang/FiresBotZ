import tmi from 'tmi.js';

export interface MessageContext {
  client: tmi.Client;
  channel: string;
  user: tmi.ChatUserstate;
  message: string;
  self: boolean;
}

export type BotCommand = (ctx: MessageContext, ...args: Array<string>) => any;
