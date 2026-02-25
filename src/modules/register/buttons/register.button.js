const { PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { getRegisterConfig, incRegistrar } = require('../services/register.service');

module.exports = {
  matchType: 'prefix',
  customId: 'register:',

  async execute({ client, interaction }) {
    if (!interaction.inGuild()) return;

    const perm = await requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
    if (!perm.ok) {
      await interaction.reply({ content: 'Yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageNicknames)) {
      await interaction.reply({ content: 'İsim yönetme yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    const parts = interaction.customId.split(':');
    const type = parts[1];
    const userId = parts[2];
    const nameRaw = parts[3];
    const age = Number(parts[4]);

    if (!['male', 'female'].includes(type) || !userId || !nameRaw || !Number.isFinite(age)) return;

    const cfg = await getRegisterConfig(interaction.guildId);
    const roleId = type === 'male' ? cfg.maleRoleId : cfg.femaleRoleId;

    if (!roleId) {
      await interaction.update({ content: 'Bu kayıt tipi için rol ayarlı değil. `/kayit-ayar` kullan.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) {
      await interaction.update({ content: 'Kullanıcı bulunamadı.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const decodedName = decodeURIComponent(nameRaw);
    const nick = `${cfg.tag ? `${cfg.tag} ` : ''}${decodedName} | ${age}`;

    await member.setNickname(nick).catch(() => null);

    const remove = [];
    if (cfg.unregisteredRoleId) remove.push(cfg.unregisteredRoleId);
    if (type === 'male' && cfg.femaleRoleId) remove.push(cfg.femaleRoleId);
    if (type === 'female' && cfg.maleRoleId) remove.push(cfg.maleRoleId);

    if (remove.length) await member.roles.remove(remove).catch(() => null);
    await member.roles.add(roleId).catch(() => null);

    await incRegistrar(interaction.guildId, interaction.user.id, type);

    await interaction.update({ content: `Kayıt tamamlandı (${type === 'male' ? 'ERKEK' : 'KADIN'}): <@${userId}>`, embeds: [], components: [] }).catch(() => null);
  }
};
