const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const { createCase } = require('../services/case.service');
const { sendLog } = require('../../logging/services/log.service');
const { getActiveJail, deactivateJail } = require('../services/jail.service');

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('unjail')
    .setDescription('Kullanıcıyı jailden çıkar ve eski rollerini geri yükle.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const jail = await getActiveJail(interaction.guildId, user.id);
    if (!jail) {
      await interaction.reply({ content: 'Aktif jail kaydı bulunamadı.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
      return;
    }

    const rolesBefore = Array.isArray(jail.rolesBefore) ? jail.rolesBefore : [];
    const validRoles = rolesBefore.filter((id) => interaction.guild.roles.cache.has(id));

    const caseId = await createCase({
      guildId: interaction.guildId,
      type: 'UNJAIL',
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason
    });

    await member.roles.set(validRoles).catch((e) => {
      throw e;
    });

    await deactivateJail(interaction.guildId, user.id);

    const embed = baseEmbed({
      title: 'UNJAIL',
      description: `Ceza ID: #${caseId}\nKullanıcı: <@${user.id}>\nYetkili: <@${interaction.user.id}>\nGeri yüklenen rol: ${validRoles.length}`
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
    await sendLog(client, interaction.guildId, embed);
  }
};
