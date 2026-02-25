const { PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { createCase } = require('../services/case.service');
const { baseEmbed } = require('../../../utils/embed');
const { sendLog } = require('../../logging/services/log.service');

module.exports = {
  matchType: 'prefix',
  customId: 'mute:',

  async execute({ client, interaction }) {
    if (!interaction.inGuild()) return;

    const perm = await requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
    if (!perm.ok) {
      await interaction.reply({ content: 'Yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      await interaction.reply({ content: 'Timeout yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    const parts = interaction.customId.split(':');
    const action = parts[1];
    const targetId = parts[2];

    if (action === 'cancel') {
      await interaction.update({ content: 'İşlem iptal edildi.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    if (!['chat', 'voice'].includes(action) || !targetId) return;

    const guild = interaction.guild;
    const targetMember = await guild.members.fetch(targetId).catch(() => null);
    if (!targetMember) {
      await interaction.update({ content: 'Kullanıcı bulunamadı.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const embed = interaction.message.embeds?.[0];
    const desc = embed?.description || '';
    const match = desc.match(/\((\d+)\s*dk\)/i);
    const minutes = match ? Number(match[1]) : 15;
    const ms = minutes * 60 * 1000;

    const reasonMatch = desc.match(/Seçim:\s*\*\*(.+?)\*\*/i);
    const reason = reasonMatch ? reasonMatch[1] : 'Belirtilmedi';

    const caseId = await createCase({
      guildId: guild.id,
      type: action === 'voice' ? 'VMUTE' : 'MUTE',
      targetId,
      moderatorId: interaction.user.id,
      reason: `${reason} | ${minutes}dk`
    });

    if (action === 'chat') {
      await targetMember.timeout(ms, `Case #${caseId} | ${interaction.user.tag} | ${reason}`).catch((e) => {
        throw e;
      });
    } else {
      await targetMember.voice.setMute(true, `Case #${caseId} | ${interaction.user.tag} | ${reason}`).catch((e) => {
        throw e;
      });
    }

    await interaction.update({ content: `${action === 'voice' ? 'Voice mute' : 'Chat mute'} uygulandı. (Ceza ID: #${caseId})`, embeds: [], components: [] }).catch(() => null);

    const logEmbed = baseEmbed({
      title: action === 'voice' ? 'VMUTE' : 'MUTE',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${targetId}> (\`${targetId}\`)\nYetkili: <@${interaction.user.id}>\nSüre: ${minutes} dk\nSebep: ${reason}`
    });

    await sendLog(client, guild.id, logEmbed);
  }
};
