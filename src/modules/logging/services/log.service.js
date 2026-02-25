const GuildConfig = require('../../../database/models/GuildConfig');
const { logger } = require('../../../utils/logger');

async function getGuildConfig(guildId) {
  let cfg = await GuildConfig.findOne({ guildId });
  if (!cfg) cfg = await GuildConfig.create({ guildId });
  return cfg;
}

async function sendLog(client, guildId, embed) {
  const cfg = await getGuildConfig(guildId);
  if (!cfg.logChannelId) return;

  const guild = await client.guilds.fetch(guildId).catch(() => null);
  const channel = guild ? await guild.channels.fetch(cfg.logChannelId).catch(() => null) : null;
  if (!channel) return;

  await channel.send({ embeds: [embed] }).catch((e) => logger.warn(`[LOG] send failed: ${e?.message || e}`));
}

async function sendErrorLog(client, guildId, embed) {
  const cfg = await getGuildConfig(guildId);
  if (!cfg.errorLogChannelId) return;

  const guild = await client.guilds.fetch(guildId).catch(() => null);
  const channel = guild ? await guild.channels.fetch(cfg.errorLogChannelId).catch(() => null) : null;
  if (!channel) return;

  await channel.send({ embeds: [embed] }).catch((e) => logger.warn(`[ERROR_LOG] send failed: ${e?.message || e}`));
}

module.exports = { getGuildConfig, sendLog, sendErrorLog };
