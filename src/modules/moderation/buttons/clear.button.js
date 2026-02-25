const { PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const { sendLog } = require('../../logging/services/log.service');
const { createCase } = require('../services/case.service');

module.exports = {
  matchType: 'prefix',
  customId: 'clear:',

  async execute({ client, interaction }) {
    if (!interaction.inGuild()) return;

    const perm = await requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
    if (!perm.ok) {
      await interaction.reply({ content: 'Yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({ content: 'Mesaj silme yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    const parts = interaction.customId.split(':');
    const action = parts[1];
    const amount = Number(parts[2]);

    if (action === 'cancel') {
      await interaction.update({ content: 'İşlem iptal edildi.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    if (action !== 'confirm' || !Number.isFinite(amount)) return;

    const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);
    const delCount = deleted?.size || 0;

    const caseId = await createCase({
      guildId: interaction.guildId,
      type: 'CLEAR',
      targetId: interaction.channelId,
      moderatorId: interaction.user.id,
      reason: `${delCount} mesaj silindi`
    });

    await interaction.update({ content: `Silindi: ${delCount} mesaj. (Ceza ID: #${caseId})`, embeds: [], components: [] }).catch(() => null);

    const logEmbed = baseEmbed({
      title: 'CLEAR',
      description: `Ceza ID: #${caseId}\nKanal: <#${interaction.channelId}>\nYetkili: <@${interaction.user.id}>\nSilinen: ${delCount}`
    });

    await sendLog(client, interaction.guildId, logEmbed);
  }
};
