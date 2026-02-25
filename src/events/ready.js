const { Events } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { logger } = require('../utils/logger');
const botConfig = require('../config/bot.config');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.info(`[READY] Logged in as ${client.user.tag}`);

    const clientId = botConfig.clientId;
    const guildId = botConfig.guildId;
    const token = botConfig.token;

    if (!clientId || !guildId || !token) {
      logger.warn('[READY] clientId/guildId/token boş. Slash komut register atlandı.');
      return;
    }

    const commands = [...client.commands.values()].map((c) => c.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(token);

    await rest
      .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
      .then(() => logger.info(`[SLASH] registered: ${commands.length}`))
      .catch((e) => logger.error(`[SLASH] register failed: ${e?.stack || e}`));
  }
};
