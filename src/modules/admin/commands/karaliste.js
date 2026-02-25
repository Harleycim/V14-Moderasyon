const { SlashCommandBuilder } = require('discord.js');
const Blacklist = require('../../../database/models/Blacklist');

module.exports = {
  category: 'admin',
  cooldown: 2,
  data: new SlashCommandBuilder()
    .setName('karaliste')
    .setDescription('Karaliste yönetimi (sadece owner).')
    .addSubcommand((s) =>
      s
        .setName('ekle')
        .setDescription('Karalisteye ekle')
        .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .addStringOption((o) => o.setName('sebep').setDescription('Sebep').setRequired(false))
    )
    .addSubcommand((s) =>
      s
        .setName('kaldir')
        .setDescription('Karalisteden kaldır')
        .addUserOption((o) => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
    )
    .addSubcommand((s) => s.setName('liste').setDescription('Karalisteyi göster')),

  async checkPermission({ client, interaction }) {
    const ok = Array.isArray(client?.config?.owners) && client.config.owners.includes(interaction.user.id);
    return { ok };
  },

  async execute({ interaction }) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'ekle') {
      const user = interaction.options.getUser('kullanici', true);
      const reason = interaction.options.getString('sebep') || null;

      await Blacklist.findOneAndUpdate(
        { userId: user.id },
        { $set: { userId: user.id, reason, moderatorId: interaction.user.id } },
        { upsert: true, new: true }
      );

      await interaction.reply({ content: `Karalisteye eklendi: <@${user.id}>`, ephemeral: true });
      return;
    }

    if (sub === 'kaldir') {
      const user = interaction.options.getUser('kullanici', true);
      await Blacklist.deleteOne({ userId: user.id });
      await interaction.reply({ content: `Karalisteden kaldırıldı: <@${user.id}>`, ephemeral: true });
      return;
    }

    const docs = await Blacklist.find({}).limit(30);
    const text = docs.length
      ? docs.map((d) => `- <@${d.userId}> (\`${d.userId}\`) ${d.reason ? `| ${d.reason}` : ''}`).join('\n')
      : 'Karaliste boş.';

    await interaction.reply({ content: text.slice(0, 1900), ephemeral: true });
  }
};
