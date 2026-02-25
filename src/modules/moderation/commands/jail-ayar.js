const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { setJailRoleId } = require('../services/jail.service');

module.exports = {
  category: 'moderation',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('jail-ayar')
    .setDescription('Jail rolünü ayarla.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((o) => o.setName('rol').setDescription('Jail rolü').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.ADMIN });
  },

  async execute({ interaction }) {
    const role = interaction.options.getRole('rol', true);
    const id = await setJailRoleId(interaction.guildId, role.id);
    await interaction.reply({ content: `Jail rolü ayarlandı: <@&${id}>`, ephemeral: true });
  }
};
