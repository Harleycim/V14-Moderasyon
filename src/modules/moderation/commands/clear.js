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

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Mesaj sil (buton onaylı).')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((o) => o.setName('adet').setDescription('Silinecek mesaj sayısı (1-100)').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ interaction }) {
    const amount = interaction.options.getInteger('adet', true);
    if (amount < 1 || amount > 100) {
      await interaction.reply({ content: '1 ile 100 arası olmalı.', ephemeral: true });
      return;
    }

    const embed = baseEmbed({
      title: 'Clear Onayı',
      description: `${amount} mesaj silinecek. Onaylıyor musun?`
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`clear:confirm:${amount}`).setStyle(ButtonStyle.Danger).setLabel('Onayla'),
      new ButtonBuilder().setCustomId(`clear:cancel:${amount}`).setStyle(ButtonStyle.Secondary).setLabel('İptal')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
