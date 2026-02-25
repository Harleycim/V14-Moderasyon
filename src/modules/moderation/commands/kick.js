const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kullanıcıyı sunucudan at (buton onaylı).')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((o) => o.setName('kullanici').setDescription('Atılacak kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ interaction }) {
    const target = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const embed = baseEmbed({
      title: 'Kick Onayı',
      description: `Kullanıcı: <@${target.id}> (\`${target.id}\`)\nSebep: ${reason}`
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`kick:confirm:${target.id}`).setStyle(ButtonStyle.Danger).setLabel('Onayla'),
      new ButtonBuilder().setCustomId(`kick:cancel:${target.id}`).setStyle(ButtonStyle.Secondary).setLabel('İptal')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
