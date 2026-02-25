const { SlashCommandBuilder } = require('discord.js');

const answers = [
  'Evet.',
  'Hayır.',
  'Belki.',
  'Kesinlikle.',
  'Bence olmaz.',
  'Şu an söyleyemem.',
  'Büyük ihtimalle.',
  'Daha sonra tekrar sor.'
];

module.exports = {
  category: 'entertainment',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('eightball')
    .setDescription('Sihirli 8 top.')
    .addStringOption((o) => o.setName('soru').setDescription('Sorun').setRequired(true)),

  async execute({ interaction }) {
    const q = interaction.options.getString('soru', true);
    const a = answers[Math.floor(Math.random() * answers.length)];
    await interaction.reply({ content: `Soru: **${q}**\nCevap: **${a}**` });
  }
};
