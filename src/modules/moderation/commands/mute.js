const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require('discord.js');

const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');

module.exports = {
  category: 'moderation',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Chat/Voice mute uygula (select + buton).')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) => o.setName('kullanici').setDescription('Mute atılacak kullanıcı').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.MOD });
  },

  async execute({ interaction }) {
    const target = interaction.options.getUser('kullanici', true);

    const defaultMinutes = 15;
    const defaultReason = 'Küfür';

    const embed = baseEmbed({
      title: 'Mute Panel',
      description: `Kullanıcı: <@${target.id}> (\`${target.id}\`)\nSeçim: **${defaultReason}** (${defaultMinutes} dk)`
    });

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('mute:reason')
        .setPlaceholder('Sebep + süre seç')
        .addOptions(
          { label: 'Küfür - 15 dakika', value: '15|Küfür' },
          { label: 'Spam - 10 dakika', value: '10|Spam' },
          { label: 'Hakaret - 30 dakika', value: '30|Hakaret' },
          { label: 'Reklam - 60 dakika', value: '60|Reklam' }
        )
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`mute:chat:${target.id}`).setStyle(ButtonStyle.Danger).setLabel('Chat Mute'),
      new ButtonBuilder().setCustomId(`mute:voice:${target.id}`).setStyle(ButtonStyle.Primary).setLabel('Voice Mute'),
      new ButtonBuilder().setCustomId(`mute:cancel:${target.id}`).setStyle(ButtonStyle.Secondary).setLabel('İptal')
    );

    await interaction.reply({ embeds: [embed], components: [selectRow, buttons], ephemeral: true });
  }
};
