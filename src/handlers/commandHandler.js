const path = require('path');
const { loadFiles } = require('../core/loader');
const { logger } = require('../utils/logger');

async function loadCommandHandler(client) {
  const commandsRoot = path.join(__dirname, '..', 'modules');
  const files = loadFiles(commandsRoot, (p) => p.endsWith('.js') && p.includes(`${path.sep}commands${path.sep}`));

  for (const file of files) {
    const command = require(file);
    if (!command?.data?.name || typeof command.execute !== 'function') {
      logger.warn(`[COMMAND] invalid file: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }

  logger.info(`[COMMAND] loaded: ${client.commands.size}`);
}

module.exports = { loadCommandHandler };
