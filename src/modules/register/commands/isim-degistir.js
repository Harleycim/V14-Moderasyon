const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const { baseEmbed } = require('../../../utils/embed');

module.exports = {
  category: 'register',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('isim-degistir')
    .setDescription('Kullanıcının ismini değiştir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    .addStringOption((o) => o.setName('isim').setDescription('Yeni isim').setRequired(true)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.STAFF });
  },

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici', true);
    const name = interaction.options.getString('isim', true);

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
      return;
    }

    await member.setNickname(name).catch(() => null);

    const embed = baseEmbed({
      title: 'İsim Değiştirildi',
      description: `Kullanıcı: <@${user.id}>\nYeni isim: **${name}**`
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
