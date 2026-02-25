const GuildConfig = require('../../../database/models/GuildConfig');
const permissionsConfig = require('../../../config/permissions.config');

async function getGuildConfig(guildId) {
  let cfg = await GuildConfig.findOne({ guildId });
  if (!cfg) cfg = await GuildConfig.create({ guildId });
  return cfg;
}

function hasAnyRole(member, roleIds) {
  if (!member || !Array.isArray(roleIds) || roleIds.length === 0) return false;
  return roleIds.some((id) => member.roles.cache.has(id));
}

async function getUserLevel(member, client) {
  if (!member) return permissionsConfig.levels.USER;

  if (client?.config?.owners?.includes(member.id)) return permissionsConfig.levels.OWNER;

  const cfg = await getGuildConfig(member.guild.id);
  const map = cfg.permissionLevels || new Map();

  const adminRoles = map.get('ADMIN') || [];
  const modRoles = map.get('MOD') || [];
  const staffRoles = map.get('STAFF') || [];

  if (hasAnyRole(member, adminRoles)) return permissionsConfig.levels.ADMIN;
  if (hasAnyRole(member, modRoles)) return permissionsConfig.levels.MOD;
  if (hasAnyRole(member, staffRoles)) return permissionsConfig.levels.STAFF;

  return permissionsConfig.levels.USER;
}

async function requireLevel({ interaction, client, requiredLevel }) {
  const level = await getUserLevel(interaction.member, client);
  return { ok: level >= requiredLevel, level };
}

module.exports = { getUserLevel, requireLevel };
