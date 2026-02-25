const { createClient } = require('./client');
const { connectMongo } = require('../database/connection');
const { registerHandlers } = require('../handlers');
const { logger } = require('../utils/logger');
const botConfig = require('../config/bot.config');

async function startBot() {
  const client = createClient();

  process.on('unhandledRejection', (err) => {
    logger.error(`[UNHANDLED_REJECTION] ${err?.stack || err}`);
  });

  process.on('uncaughtException', (err) => {
    logger.error(`[UNCAUGHT_EXCEPTION] ${err?.stack || err}`);
  });

  await connectMongo();
  await registerHandlers(client);

  await client.login(botConfig.token);

  return client;
}

module.exports = { startBot };
