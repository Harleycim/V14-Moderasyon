const Counter = require('../../../database/models/Counter');
const CaseModel = require('../../../database/models/Case');

async function nextCaseId(guildId) {
  const doc = await Counter.findOneAndUpdate(
    { guildId, key: 'case' },
    { $inc: { seq: 1 }, $setOnInsert: { guildId, key: 'case', seq: 0 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

async function createCase({ guildId, type, targetId, moderatorId, reason }) {
  const caseId = await nextCaseId(guildId);
  await CaseModel.create({ guildId, caseId, type, targetId, moderatorId, reason: reason || null });
  return caseId;
}

module.exports = { nextCaseId, createCase };
