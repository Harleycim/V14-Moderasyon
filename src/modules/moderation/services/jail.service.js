const GuildConfig = require('../../../database/models/GuildConfig');
const Jail = require('../../../database/models/Jail');

async function getGuildConfig(guildId) {
  let cfg = await GuildConfig.findOne({ guildId });
  if (!cfg) cfg = await GuildConfig.create({ guildId });
  return cfg;
}

async function getJailRoleId(guildId) {
  const cfg = await getGuildConfig(guildId);
  return cfg.jailRoleId;
}

async function setJailRoleId(guildId, roleId) {
  const cfg = await getGuildConfig(guildId);
  cfg.jailRoleId = roleId;
  await cfg.save();
  return cfg.jailRoleId;
}

async function createJail({ guildId, userId, rolesBefore, caseId, moderatorId, reason }) {
  await Jail.create({ guildId, userId, rolesBefore, caseId, moderatorId, reason: reason || null, active: true });
}

async function deactivateJail(guildId, userId) {
  const doc = await Jail.findOneAndUpdate({ guildId, userId, active: true }, { $set: { active: false } }, { new: true });
  return doc;
}

async function getActiveJail(guildId, userId) {
  return Jail.findOne({ guildId, userId, active: true });
}

module.exports = { getJailRoleId, setJailRoleId, createJail, deactivateJail, getActiveJail };
