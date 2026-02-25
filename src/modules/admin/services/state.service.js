const BotState = require('../../../database/models/BotState');

async function getState() {
  let doc = await BotState.findOne({ key: 'global' });
  if (!doc) doc = await BotState.create({ key: 'global', maintenance: false });
  return doc;
}

async function setMaintenance(value) {
  const doc = await BotState.findOneAndUpdate(
    { key: 'global' },
    { $set: { maintenance: Boolean(value) }, $setOnInsert: { key: 'global' } },
    { new: true, upsert: true }
  );
  return doc.maintenance;
}

module.exports = { getState, setMaintenance };
