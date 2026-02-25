const { PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { createCase } = require('../services/case.service');
const { baseEmbed } = require('../../../utils/embed');
const { sendLog } = require('../../logging/services/log.service');
const { getJailRoleId, createJail } = require('../services/jail.service');

module.exports = {
  matchType: 'prefix',
  customId: 'jail:',

  async execute({ client, interaction }) {
    if (!interaction.inGuild()) return;

    const perm = await requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
    if (!perm.ok) {
      await interaction.reply({ content: 'Yetkin yok.', ephemeral: true }).catch(() => null);
      return;
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({ content: 'Rol yönetme yetkin yok.', ephemeral: true }).catch(() => null);
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

    const jailRoleId = await getJailRoleId(interaction.guildId);
    if (!jailRoleId) {
      await interaction.update({ content: 'Jail rolü ayarlı değil.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const guild = interaction.guild;
    const member = await guild.members.fetch(targetId).catch(() => null);
    if (!member) {
      await interaction.update({ content: 'Kullanıcı bulunamadı.', embeds: [], components: [] }).catch(() => null);
      return;
    }

    const rolesBefore = member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r.id);

    const caseId = await createCase({
      guildId: guild.id,
      type: 'JAIL',
      targetId,
      moderatorId: interaction.user.id,
      reason: 'Buton ile jail'
    });

    await createJail({
      guildId: guild.id,
      userId: targetId,
      rolesBefore,
      caseId,
      moderatorId: interaction.user.id,
      reason: 'Buton ile jail'
    });

    await member.roles.set([jailRoleId]).catch((e) => {
      throw e;
    });

    await interaction.update({ content: `Jail uygulandı. (Ceza ID: #${caseId})`, embeds: [], components: [] }).catch(() => null);

    const logEmbed = baseEmbed({
      title: 'JAIL',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${targetId}> (\`${targetId}\`)\nYetkili: <@${interaction.user.id}>`
    });

    await sendLog(client, guild.id, logEmbed);
  }
};
