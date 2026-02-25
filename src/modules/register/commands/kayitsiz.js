const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { getRegisterConfig } = require('../services/register.service');

module.exports = {
  category: 'register',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('kayitsiz')
    .setDescription('Kayıtsıza at.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const cfg = await getRegisterConfig(interaction.guildId);

    if (!cfg.unregisteredRoleId) {
      await interaction.reply({ content: 'Kayıtsız rolü ayarlı değil. `/kayit-ayar` kullan.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
      return;
    }

    const add = [cfg.unregisteredRoleId];
    const remove = [];
    if (cfg.maleRoleId) remove.push(cfg.maleRoleId);
    if (cfg.femaleRoleId) remove.push(cfg.femaleRoleId);

    if (remove.length) await member.roles.remove(remove).catch(() => null);
    await member.roles.add(add).catch(() => null);

    await interaction.reply({ content: `Kayıtsıza atıldı: <@${user.id}>`, ephemeral: true });
  }
};
