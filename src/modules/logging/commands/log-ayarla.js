const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../services/permission.service');
const GuildConfig = require('../../../database/models/GuildConfig');

module.exports = {
  category: 'system',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('log-ayarla')
    .setDescription('Log kanallarını ayarla.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((o) =>
      o
        .setName('log')
        .setDescription('Log kanalı')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addChannelOption((o) =>
      o
        .setName('hata')
        .setDescription('Hata log kanalı')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.ADMIN });
  },

  async execute({ interaction }) {
    const log = interaction.options.getChannel('log');
    const err = interaction.options.getChannel('hata');

    let cfg = await GuildConfig.findOne({ guildId: interaction.guildId });
    if (!cfg) cfg = await GuildConfig.create({ guildId: interaction.guildId });

    if (log) cfg.logChannelId = log.id;
    if (err) cfg.errorLogChannelId = err.id;

    await cfg.save();

    await interaction.reply({
      content: `Ayarlandı. Log: ${cfg.logChannelId ? `<#${cfg.logChannelId}>` : 'yok'} | Hata: ${cfg.errorLogChannelId ? `<#${cfg.errorLogChannelId}>` : 'yok'}`,
      ephemeral: true
    });
  }
};
