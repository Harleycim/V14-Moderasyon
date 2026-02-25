const { SlashCommandBuilder } = require('discord.js');
const RegisterStats = require('../../../database/models/RegisterStats');
const { baseEmbed } = require('../../../utils/embed');

module.exports = {
  category: 'register',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('kayit-istatistik')
    .setDescription('Kayıt istatistiklerini göster.')
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı (opsiyonel)').setRequired(false)),

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici') || interaction.user;

    const st = await RegisterStats.findOne({ guildId: interaction.guildId, registrarId: user.id });

    const embed = baseEmbed({
      title: 'Kayıt İstatistik',
      description: st
        ? `Kullanıcı: <@${user.id}>\nToplam: **${st.total}**\nErkek: **${st.male}**\nKadın: **${st.female}**`
        : `Kullanıcı: <@${user.id}>\nKayıt yok.`
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
