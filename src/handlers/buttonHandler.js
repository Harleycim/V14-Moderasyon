const path = require('path');
const { loadFiles } = require('../core/loader');
const { logger } = require('../utils/logger');

async function loadButtonHandler(client) {
  const root = path.join(__dirname, '..', 'modules');
  const files = loadFiles(root, (p) => p.endsWith('.js') && p.includes(`${path.sep}buttons${path.sep}`));

  client.buttonPrefixes = [];

  for (const file of files) {
    const btn = require(file);
    if (!btn?.customId || typeof btn.execute !== 'function') {
      logger.warn(`[BUTTON] invalid file: ${file}`);
      continue;
    }

    if (btn.matchType === 'prefix') {
      client.buttonPrefixes.push(btn);
    } else {
      client.buttons.set(btn.customId, btn);
    }
  }

  logger.info(`[BUTTON] loaded: ${client.buttons.size} exact, ${client.buttonPrefixes.length} prefix`);
}

module.exports = { loadButtonHandler };
