const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const { createCase } = require('../services/case.service');
const Warn = require('../../../database/models/Warn');
const { sendLog } = require('../../logging/services/log.service');

module.exports = {
  category: 'moderation',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Kullanıcıyı uyar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) => o.setName('kullanici').setDescription('Uyarılacak kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
  },

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const caseId = await createCase({
      guildId: interaction.guildId,
      type: 'WARN',
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason
    });

    await Warn.create({
      guildId: interaction.guildId,
      userId: user.id,
      caseId,
      moderatorId: interaction.user.id,
      reason,
      active: true
    });

    const embed = baseEmbed({
      title: 'Uyarı',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${user.id}>\nSebep: ${reason}`
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });

    const logEmbed = baseEmbed({
      title: 'WARN',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${user.id}> (\`${user.id}\`)\nYetkili: <@${interaction.user.id}>\nSebep: ${reason}`
    });
    await sendLog(client, interaction.guildId, logEmbed);
  }
};
