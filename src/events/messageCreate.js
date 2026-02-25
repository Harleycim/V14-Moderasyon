const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(client, message) {
    if (!message || message.author?.bot) return;

    const prefix = client?.config?.prefix || '.';
    if (!message.content?.startsWith(prefix)) return;

    const raw = message.content.slice(prefix.length).trim();
    if (!raw.length) return;

    const args = raw.split(/\s+/g);
    const name = args.shift()?.toLowerCase();
    if (!name) return;

    const cmd = client.prefixCommands?.get(name);
    if (!cmd) return;

    await cmd.execute({ client, message, args });
  }
};
