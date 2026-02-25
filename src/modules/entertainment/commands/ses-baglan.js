const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  category: 'system',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ses-baglan')
    .setDescription('Botu ses kanalına bağla.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((o) =>
      o
        .setName('kanal')
        .setDescription('Ses kanalı (boş bırakırsan bulunduğun kanal)')
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(false)
    ),

  async execute({ interaction }) {
    const channel = interaction.options.getChannel('kanal') || interaction.member?.voice?.channel;

    if (!channel) {
      await interaction.reply({ content: 'Bir ses kanalında olmalısın ya da kanal seçmelisin.', ephemeral: true });
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 15_000);

    await interaction.reply({ content: `Ses kanalına bağlandım: <#${channel.id}>`, ephemeral: true });
  }
};
