const path = require('path');
const { loadFiles } = require('../core/loader');
const { logger } = require('../utils/logger');

async function loadPrefixCommandHandler(client) {
  const root = path.join(__dirname, '..', 'modules');
  const files = loadFiles(root, (p) => p.endsWith('.js') && p.includes(`${path.sep}prefix${path.sep}`));

  for (const file of files) {
    const cmd = require(file);
    if (!cmd?.name || typeof cmd.execute !== 'function') {
      logger.warn(`[PREFIX] invalid file: ${file}`);
      continue;
    }
    client.prefixCommands.set(cmd.name, cmd);
  }

  logger.info(`[PREFIX] loaded: ${client.prefixCommands.size}`);
}

module.exports = { loadPrefixCommandHandler };
