const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');
const { getJailRoleId } = require('../services/jail.service');

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('jail')
    .setDescription('Kullanıcıyı jail rolüne al (buton onaylı).')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ interaction }) {
    const target = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const jailRoleId = await getJailRoleId(interaction.guildId);
    if (!jailRoleId) {
      await interaction.reply({ content: 'Jail rolü ayarlı değil. Önce `/jail-ayar` kullan.', ephemeral: true });
      return;
    }

    const embed = baseEmbed({
      title: 'Jail Onayı',
      description: `Kullanıcı: <@${target.id}> (\`${target.id}\`)\nSebep: ${reason}`
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`jail:confirm:${target.id}`).setStyle(ButtonStyle.Danger).setLabel('Onayla'),
      new ButtonBuilder().setCustomId(`jail:cancel:${target.id}`).setStyle(ButtonStyle.Secondary).setLabel('İptal')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
