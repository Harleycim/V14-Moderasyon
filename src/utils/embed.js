const { EmbedBuilder } = require('discord.js');

function baseEmbed(options = {}) {
  const e = new EmbedBuilder();
  if (options.color) e.setColor(options.color);
  if (options.title) e.setTitle(options.title);
  if (options.description) e.setDescription(options.description);
  if (options.footer) e.setFooter(options.footer);
  if (options.timestamp !== false) e.setTimestamp();
  return e;
}

module.exports = { baseEmbed };
