const { Schema, model } = require('mongoose');

const WarnSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    caseId: { type: Number, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, default: null },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

WarnSchema.index({ guildId: 1, userId: 1, active: 1 });

module.exports = model('Warn', WarnSchema);
