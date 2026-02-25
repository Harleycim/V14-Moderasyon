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
  category: 'register',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('kayit')
    .setDescription('İsim ve yaş gir, Erkek/Kadın butonundan seçerek kayıt et.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('isim').setDescription('İsim').setRequired(true))
    .addIntegerOption((o) => o.setName('yas').setDescription('Yaş').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
  },

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const name = interaction.options.getString('isim', true);
    const age = interaction.options.getInteger('yas', true);

    if (age < 10 || age > 99) {
      await interaction.reply({ content: 'Yaş 10 ile 99 arası olmalı.', ephemeral: true });
      return;
    }

    const embed = baseEmbed({
      title: 'Kayıt Paneli',
      description: `Kullanıcı: <@${user.id}> (\`${user.id}\`)\nİsim: **${name}**\nYaş: **${age}**`
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`register:male:${user.id}:${encodeURIComponent(name)}:${age}`)
        .setStyle(ButtonStyle.Primary)
        .setLabel('ERKEK'),
      new ButtonBuilder()
        .setCustomId(`register:female:${user.id}:${encodeURIComponent(name)}:${age}`)
        .setStyle(ButtonStyle.Danger)
        .setLabel('KADIN')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
