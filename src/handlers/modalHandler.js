const path = require('path');
const { loadFiles } = require('../core/loader');
const { logger } = require('../utils/logger');

async function loadModalHandler(client) {
  const root = path.join(__dirname, '..', 'modules');
  const files = loadFiles(root, (p) => p.endsWith('.js') && p.includes(`${path.sep}modals${path.sep}`));

  for (const file of files) {
    const modal = require(file);
    if (!modal?.customId || typeof modal.execute !== 'function') {
      logger.warn(`[MODAL] invalid file: ${file}`);
      continue;
    }
    client.modals.set(modal.customId, modal);
  }

  logger.info(`[MODAL] loaded: ${client.modals.size}`);
}

module.exports = { loadModalHandler };
