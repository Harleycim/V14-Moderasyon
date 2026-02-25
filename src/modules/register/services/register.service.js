const RegisterConfig = require('../../../database/models/RegisterConfig');
const RegisterStats = require('../../../database/models/RegisterStats');

async function getRegisterConfig(guildId) {
  let cfg = await RegisterConfig.findOne({ guildId });
  if (!cfg) cfg = await RegisterConfig.create({ guildId });
  return cfg;
}

async function incRegistrar(guildId, registrarId, type) {
  const inc = { total: 1 };
  if (type === 'male') inc.male = 1;
  if (type === 'female') inc.female = 1;

  await RegisterStats.findOneAndUpdate(
    { guildId, registrarId },
    { $inc: inc, $setOnInsert: { guildId, registrarId } },
    { new: true, upsert: true }
  );
}

module.exports = { getRegisterConfig, incRegistrar };
