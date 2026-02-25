const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../../utils/embed');

module.exports = {
  category: 'system',
  cooldown: 5,
  data: new SlashCommandBuilder().setName('say').setDescription('Sunucu istatistiklerini göster.'),

  async execute({ interaction }) {
    const g = interaction.guild;
    const total = g.memberCount;
    const bots = g.members.cache.filter((m) => m.user.bot).size;
    const humans = Math.max(total - bots, 0);

    const embed = baseEmbed({
      title: 'Sunucu İstatistik',
      description: `Toplam: **${total}**\nİnsan: **${humans}**\nBot: **${bots}**`
    });

    await interaction.reply({ embeds: [embed] });
  }
};
