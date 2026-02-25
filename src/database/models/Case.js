const { Schema, model } = require('mongoose');

const CaseSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    caseId: { type: Number, required: true, index: true },

    type: { type: String, required: true },
    targetId: { type: String, required: true },
    moderatorId: { type: String, required: true },

    reason: { type: String, default: null },
    createdAtMs: { type: Number, default: () => Date.now() }
  },
  { timestamps: true }
);

CaseSchema.index({ guildId: 1, caseId: 1 }, { unique: true });

module.exports = model('Case', CaseSchema);
