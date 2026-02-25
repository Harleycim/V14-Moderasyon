const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const { createCase } = require('../services/case.service');
const { sendLog } = require('../../logging/services/log.service');

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Kullanıcının banını kaldır.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((o) => o.setName('id').setDescription('Kullanıcı ID').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ client, interaction }) {
    const id = interaction.options.getString('id', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const bans = await interaction.guild.bans.fetch().catch(() => null);
    if (!bans || !bans.has(id)) {
      await interaction.reply({ content: 'Bu kullanıcı banlı değil veya bulunamadı.', ephemeral: true });
      return;
    }

    const caseId = await createCase({
      guildId: interaction.guildId,
      type: 'UNBAN',
      targetId: id,
      moderatorId: interaction.user.id,
      reason
    });

    await interaction.guild.members.unban(id, `Case #${caseId} | ${interaction.user.tag} | ${reason}`).catch((e) => {
      throw e;
    });

    const embed = baseEmbed({
      title: 'UNBAN',
      description: `Ceza ID: #${caseId}\nKullanıcı: \`${id}\`\nYetkili: <@${interaction.user.id}>\nSebep: ${reason}`
    });

    await interaction.reply({ embeds: [embed] });
    await sendLog(client, interaction.guildId, embed);
  }
};
