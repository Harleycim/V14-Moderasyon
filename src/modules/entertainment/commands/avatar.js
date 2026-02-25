const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'entertainment',
  cooldown: 2,
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Kullanıcının avatarını göster.')
    .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(false)),

  async execute({ interaction }) {
    const user = interaction.options.getUser('kullanici') || interaction.user;
    const url = user.displayAvatarURL({ size: 1024 });
    await interaction.reply({ content: url });
  }
};
