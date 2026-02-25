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
    .setName('ban')
    .setDescription('Kullanıcıyı sunucudan yasakla (buton onaylı).')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((o) => o.setName('kullanici').setDescription('Banlanacak kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ interaction }) {
    const target = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';

    const embed = baseEmbed({
      title: 'Ban Onayı',
      description: `Kullanıcı: <@${target.id}> (\`${target.id}\`)\nSebep: ${reason}`
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ban:confirm:${target.id}`)
        .setStyle(ButtonStyle.Danger)
        .setLabel('Onayla'),
      new ButtonBuilder().setCustomId(`ban:cancel:${target.id}`).setStyle(ButtonStyle.Secondary).setLabel('İptal')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
