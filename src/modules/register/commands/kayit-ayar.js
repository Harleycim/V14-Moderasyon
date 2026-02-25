const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permissionsConfig = require('../../../config/permissions.config');
const { requireLevel } = require('../../logging/services/permission.service');
const RegisterConfig = require('../../../database/models/RegisterConfig');

module.exports = {
  category: 'register',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('kayit-ayar')
    .setDescription('Kayıt ayarlarını yap.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((o) => o.setName('erkek-rol').setDescription('Erkek rolü').setRequired(false))
    .addRoleOption((o) => o.setName('kadin-rol').setDescription('Kadın rolü').setRequired(false))
    .addRoleOption((o) => o.setName('kayitsiz-rol').setDescription('Kayıtsız rolü').setRequired(false))
    .addStringOption((o) => o.setName('tag').setDescription('İsim tagı').setRequired(false)),

  async checkPermission({ client, interaction }) {
    return requireLevel({ interaction, client, requiredLevel: permissionsConfig.levels.ADMIN });
  },

  async execute({ interaction }) {
    const maleRole = interaction.options.getRole('erkek-rol');
    const femaleRole = interaction.options.getRole('kadin-rol');
    const unregRole = interaction.options.getRole('kayitsiz-rol');
    const tag = interaction.options.getString('tag');

    let cfg = await RegisterConfig.findOne({ guildId: interaction.guildId });
    if (!cfg) cfg = await RegisterConfig.create({ guildId: interaction.guildId });

    if (maleRole) cfg.maleRoleId = maleRole.id;
    if (femaleRole) cfg.femaleRoleId = femaleRole.id;
    if (unregRole) cfg.unregisteredRoleId = unregRole.id;
    if (typeof tag === 'string') cfg.tag = tag;

    await cfg.save();

    await interaction.reply({
      content: `Kayıt ayarlandı. Erkek: ${cfg.maleRoleId ? `<@&${cfg.maleRoleId}>` : 'yok'} | Kadın: ${cfg.femaleRoleId ? `<@&${cfg.femaleRoleId}>` : 'yok'} | Kayıtsız: ${cfg.unregisteredRoleId ? `<@&${cfg.unregisteredRoleId}>` : 'yok'} | Tag: ${cfg.tag || 'yok'}`,
      ephemeral: true
    });
  }
};
