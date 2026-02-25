const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { getRegisterConfig, incRegistrar } = require('../services/register.service');

module.exports = {
  category: 'register',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('erkek')
    .setDescription('Erkek olarak kayıt et.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('isim').setDescription('İsim').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
  },

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const name = interaction.options.getString('isim', true);

    const cfg = await getRegisterConfig(interaction.guildId);
    if (!cfg.maleRoleId) {
      await interaction.reply({ content: 'Erkek rolü ayarlı değil. `/kayit-ayar` kullan.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
      return;
    }

    const nick = `${cfg.tag ? `${cfg.tag} ` : ''}${name}`;
    await member.setNickname(nick).catch(() => null);

    const roles = [];
    if (cfg.unregisteredRoleId) roles.push(cfg.unregisteredRoleId);

    if (roles.length) await member.roles.remove(roles).catch(() => null);
    await member.roles.add(cfg.maleRoleId).catch(() => null);

    await incRegistrar(interaction.guildId, interaction.user.id, 'male');

    await interaction.reply({ content: `Kayıt tamam: <@${user.id}>`, ephemeral: true });
  }
};
