const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const botConfig = require('../config/bot.config');

function createClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
  });

  client.commands = new Collection();
  client.prefixCommands = new Collection();
  client.buttons = new Collection();
  client.modals = new Collection();
  client.selects = new Collection();
  client.cooldowns = new Collection();

  client.config = {
    owners: Array.isArray(botConfig.ownerIds) ? botConfig.ownerIds : [],
    prefix: typeof botConfig.prefix === 'string' && botConfig.prefix.length ? botConfig.prefix : '.'
  };

  return client;
}

module.exports = { createClient };
