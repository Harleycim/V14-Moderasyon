const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const { createCase } = require('../services/case.service');
const Warn = require('../../../database/models/Warn');
const { sendLog } = require('../../logging/services/log.service');

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Uyarıyı kaldır (caseId ile).')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addIntegerOption((o) => o.setName('case').setDescription('Uyarı Case ID').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
  },

  async execute({ client, interaction }) {
    const caseId = interaction.options.getInteger('case', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const warn = await Warn.findOne({ guildId: interaction.guildId, caseId, active: true });
    if (!warn) {
      await interaction.reply({ content: 'Aktif uyarı bulunamadı.', ephemeral: true });
      return;
    }

    warn.active = false;
    await warn.save();

    const logCaseId = await createCase({
      guildId: interaction.guildId,
      type: 'UNWARN',
      targetId: warn.userId,
      moderatorId: interaction.user.id,
      reason: `Warn #${caseId} kaldırıldı | ${reason}`
    });

    const embed = baseEmbed({
      title: 'UNWARN',
      description: `Kaldırılan uyarı: #${caseId}\nİşlem Case: #${logCaseId}\nKullanıcı: <@${warn.userId}>\nYetkili: <@${interaction.user.id}>\nSebep: ${reason}`
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
    await sendLog(client, interaction.guildId, embed);
  }
};
