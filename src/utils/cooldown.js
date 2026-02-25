function getCooldownKey(interaction, commandName) {
  return `${interaction.user.id}:${commandName}`;
}

function checkCooldown(client, interaction, command) {
  const now = Date.now();
  const seconds = Number(command.cooldown ?? 0);
  if (!seconds || seconds <= 0) return { ok: true };

  const key = getCooldownKey(interaction, command.data.name);
  const until = client.cooldowns.get(key);

  if (until && until > now) {
    const remaining = Math.ceil((until - now) / 1000);
    return { ok: false, remaining };
  }

  client.cooldowns.set(key, now + seconds * 1000);
  return { ok: true };
}

module.exports = { checkCooldown };
