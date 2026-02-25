const { SlashCommandBuilder } = require('discord.js');

const jokes = [
  'Programcılar neden denize girmez? Çünkü byte byte ıslanırlar.',
  'Bug buldum! Ama ezmeye kıyamadım.',
  'Kod yazarken kahve içmeyenlere inanmayın.',
  'Java ile JavaScript akraba değil, sadece isim benziyor.'
];

module.exports = {
  category: 'entertainment',
  cooldown: 3,
  data: new SlashCommandBuilder().setName('espri').setDescription('Rastgele espri yap.'),

  async execute({ interaction }) {
    const j = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply({ content: j });
  }
};
