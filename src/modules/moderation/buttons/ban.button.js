const { PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { createCase } = require('../services/case.service');
const { baseEmbed } = require('../../../utils/embed');
const { sendLog } = require('../../logging/services/log.service');

module.exports = {
  matchType: 'prefix',
  customId: 'ban:',

  async execute({ client, interaction }) {
    if (!interaction.inGuild()) return;

    const perm = await requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
    if (!perm.ok) {
      await interaction.reply({ content: 'Yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: 'Ban yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    const parts = interaction.customId.split(':');
    const action = parts[1];
    const targetId = parts[2];

    if (!action || !targetId) return;

    if (action === 'cancel') {
      await interaction.update({ content: 'İşlem iptal edildi.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    if (action !== 'confirm') return;

    const guild = interaction.guild;
    const targetMember = await guild.members.fetch(targetId).catch(() => null);
    if (!targetMember) {
      await interaction.update({ content: 'Kullanıcı bulunamadı.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    if (!targetMember.bannable) {
      await interaction.update({ content: 'Bu kullanıcı banlanamıyor (rol/yetki).', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const caseId = await createCase({
      guildId: guild.id,
      type: 'BAN',
      targetId,
      moderatorId: interaction.user.id,
      reason: 'Buton ile ban'
    });

    await targetMember.ban({ reason: `Case #${caseId} | ${interaction.user.tag}` }).catch((e) => {
      throw e;
    });

    await interaction.update({ content: `Banlandı. (Ceza ID: #${caseId})`, embeds: [], components: [] }).catch(() => null);

    const logEmbed = baseEmbed({
      title: 'BAN',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${targetId}> (\`${targetId}\`)\nYetkili: <@${interaction.user.id}>`
    });

    await sendLog(client, guild.id, logEmbed);
  }
};
