const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'entertainment',
  cooldown: 2,
  data: new SlashCommandBuilder().setName('zar').setDescription('Zar at (1-6).'),

  async execute({ interaction }) {
    const n = Math.floor(Math.random() * 6) + 1;
    await interaction.reply({ content: `Zar: **${n}**` });
  }
};
