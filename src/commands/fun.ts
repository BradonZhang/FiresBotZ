import { BotCommand } from 'interfaces';

const cmdChance: BotCommand = ({ client, channel }, ...args) => {
  client.say(channel, `There's a ${Math.round(Math.random() * 100)}% chance ${args.join(' ')}`);
};

const cmdCoin: BotCommand = ({ client, channel }) => {
  client.say(channel, Math.random() < 0.5 ? 'Heads!' : 'Tails!');
};

export default {
  '!chance': cmdChance,
  '!coin': cmdCoin,
};
