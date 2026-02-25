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
    .setName('unmute')
    .setDescription('Kullanıcının timeout (mute) işlemini kaldır.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
      return;
    }

    const caseId = await createCase({
      guildId: interaction.guildId,
      type: 'UNMUTE',
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason
    });

    await member.timeout(null, `Case #${caseId} | ${interaction.user.tag} | ${reason}`).catch((e) => {
      throw e;
    });

    const embed = baseEmbed({
      title: 'UNMUTE',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${user.id}>\nYetkili: <@${interaction.user.id}>\nSebep: ${reason}`
    });

    await interaction.reply({ embeds: [embed] });
    await sendLog(client, interaction.guildId, embed);
  }
};
