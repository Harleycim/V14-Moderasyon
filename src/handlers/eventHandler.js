const path = require('path');
const { loadFiles } = require('../core/loader');
const { logger } = require('../utils/logger');

async function loadEventHandler(client) {
  const root = path.join(__dirname, '..');
  const files = loadFiles(root, (p) => p.endsWith('.js') && (p.includes(`${path.sep}events${path.sep}`) || p.includes(`${path.sep}modules${path.sep}`) && p.includes(`${path.sep}events${path.sep}`)));

  let count = 0;
  for (const file of files) {
    const event = require(file);
    if (!event?.name || typeof event.execute !== 'function') {
      logger.warn(`[EVENT] invalid file: ${file}`);
      continue;
    }

    if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
    else client.on(event.name, (...args) => event.execute(client, ...args));

    count++;
  }

  logger.info(`[EVENT] loaded: ${count}`);
}

module.exports = { loadEventHandler };
