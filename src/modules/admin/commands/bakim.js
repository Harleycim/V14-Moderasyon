const { SlashCommandBuilder } = require('discord.js');
const { setMaintenance, getState } = require('../services/state.service');

module.exports = {
  category: 'admin',
  cooldown: 2,
  data: new SlashCommandBuilder()
    .setName('bakim')
    .setDescription('Bakım modunu aç/kapat (sadece owner).')
    .addBooleanOption((o) => o.setName('durum').setDescription('true/false').setRequired(false)),

  async checkPermission({ client, interaction }) {
    const ok = Array.isArray(client?.config?.owners) && client.config.owners.includes(interaction.user.id);
    return { ok };
  },

  async execute({ interaction }) {
    const value = interaction.options.getBoolean('durum');

    if (typeof value === 'boolean') {
      const current = await setMaintenance(value);
      await interaction.reply({ content: `Bakım modu: ${current ? 'AÇIK' : 'KAPALI'}`, ephemeral: true });
      return;
    }

    const st = await getState();
    await interaction.reply({ content: `Bakım modu: ${st.maintenance ? 'AÇIK' : 'KAPALI'}`, ephemeral: true });
  }
};
