function requireGuild(interaction) {
  if (!interaction.inGuild()) {
    return { ok: false, reason: 'Bu komut sadece sunucuda kullanılabilir.' };
  }
  return { ok: true };
}

module.exports = { requireGuild };
