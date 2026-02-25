const { SlashCommandBuilder } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const Warn = require('../../../database/models/Warn');

module.exports = {
  category: 'moderation',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Kullanıcının uyarılarını göster.')
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
  },

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici', true);

    const warns = await Warn.find({ guildId: interaction.guildId, userId: user.id, active: true })
      .sort({ createdAt: -1 })
      .limit(15);

    const desc = warns.length
      ? warns.map((w) => `#${w.caseId} - ${w.reason || 'Sebep yok'} (Yetkili: <@${w.moderatorId}>)`).join('\n')
      : 'Aktif uyarı yok.';

    const embed = baseEmbed({
      title: `Uyarılar: ${user.tag}`,
      description: desc
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
