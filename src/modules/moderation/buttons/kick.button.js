const { PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { createCase } = require('../services/case.service');
const { baseEmbed } = require('../../../utils/embed');
const { sendLog } = require('../../logging/services/log.service');

module.exports = {
  matchType: 'prefix',
  customId: 'kick:',

  async execute({ client, interaction }) {
    if (!interaction.inGuild()) return;

    const perm = await requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
    if (!perm.ok) {
      await interaction.reply({ content: 'Yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: 'Kick yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    const parts = interaction.customId.split(':');
    const action = parts[1];
    const targetId = parts[2];

    if (action === 'cancel') {
      await interaction.update({ content: 'İşlem iptal edildi.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    if (action !== 'confirm' || !targetId) return;

    const guild = interaction.guild;
    const targetMember = await guild.members.fetch(targetId).catch(() => null);
    if (!targetMember) {
      await interaction.update({ content: 'Kullanıcı bulunamadı.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    if (!targetMember.kickable) {
      await interaction.update({ content: 'Bu kullanıcı atılamıyor (rol/yetki).', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const caseId = await createCase({
      guildId: guild.id,
      type: 'KICK',
      targetId,
      moderatorId: interaction.user.id,
      reason: 'Buton ile kick'
    });

    await targetMember.kick(`Case #${caseId} | ${interaction.user.tag}`).catch((e) => {
      throw e;
    });

    await interaction.update({ content: `Atıldı. (Ceza ID: #${caseId})`, embeds: [], components: [] }).catch(() => null);

    const logEmbed = baseEmbed({
      title: 'KICK',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${targetId}> (\`${targetId}\`)\nYetkili: <@${interaction.user.id}>`
    });

    await sendLog(client, guild.id, logEmbed);
  }
};
