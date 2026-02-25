const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  category: 'system',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ses-ayril')
    .setDescription('Botu ses kanalından çıkar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute({ interaction }) {
    const conn = getVoiceConnection(interaction.guildId);
    if (!conn) {
      await interaction.reply({ content: 'Zaten bir ses kanalında değilim.', ephemeral: true });
      return;
    }

    conn.destroy();
    await interaction.reply({ content: 'Ses kanalından ayrıldım.', ephemeral: true });
  }
};
