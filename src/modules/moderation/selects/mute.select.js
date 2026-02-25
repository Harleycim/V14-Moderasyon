module.exports = {
  customId: 'mute:reason',

  async execute({ interaction }) {
    const selected = interaction.values?.[0];
    if (!selected) return;

    const parts = selected.split('|');
    const minutes = Number(parts[0]);
    const reason = parts.slice(1).join('|') || 'Belirtilmedi';

    const [embed] = interaction.message.embeds || [];

    await interaction.update({
      embeds: embed
        ? [
            {
              ...embed.toJSON(),
              description: `${embed.description || ''}\nSeçim: **${reason}** (${minutes} dk)`
            }
          ]
        : [],
      components: interaction.message.components
    });

    // selected preset'i butonların customId'sine yazmak yerine message state olarak embed içinde tutuyoruz.
    // Buton handler embed'den parse edecek.
  }
};
