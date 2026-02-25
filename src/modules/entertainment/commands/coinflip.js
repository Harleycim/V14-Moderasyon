const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'entertainment',
  cooldown: 2,
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Yazı/Tura at.'),

  async execute({ interaction }) {
    const res = Math.random() < 0.5 ? 'Yazı' : 'Tura';
    await interaction.reply({ content: `Sonuç: **${res}**` });
  }
};
