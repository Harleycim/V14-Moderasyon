const path = require('path');
const { loadFiles } = require('../core/loader');
const { logger } = require('../utils/logger');

async function loadSelectHandler(client) {
  const root = path.join(__dirname, '..', 'modules');
  const files = loadFiles(root, (p) => p.endsWith('.js') && p.includes(`${path.sep}selects${path.sep}`));

  client.selectPrefixes = [];

  for (const file of files) {
    const sel = require(file);
    if (!sel?.customId || typeof sel.execute !== 'function') {
      logger.warn(`[SELECT] invalid file: ${file}`);
      continue;
    }

    if (sel.matchType === 'prefix') client.selectPrefixes.push(sel);
    else client.selects.set(sel.customId, sel);
  }

  logger.info(`[SELECT] loaded: ${client.selects.size} exact, ${client.selectPrefixes.length} prefix`);
}

module.exports = { loadSelectHandler };
