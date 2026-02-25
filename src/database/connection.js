const mongoose = require('mongoose');
const botConfig = require('../config/bot.config');
const { logger } = require('../utils/logger');

let connected = false;

async function connectMongo() {
  if (connected) return;

  const uri = botConfig.mongoUri;
  if (!uri) {
    logger.warn('[MONGO] mongoUri boş. MongoDB bağlantısı atlandı.');
    return;
  }

  await mongoose.connect(uri);
  connected = true;
  logger.info('[MONGO] connected');
}

module.exports = { connectMongo };
