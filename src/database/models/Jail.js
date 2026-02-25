const { Schema, model } = require('mongoose');

const JailSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    active: { type: Boolean, default: true },

    rolesBefore: { type: [String], default: [] },

    caseId: { type: Number, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, default: null }
  },
  { timestamps: true }
);

JailSchema.index({ guildId: 1, userId: 1, active: 1 });

module.exports = model('Jail', JailSchema);
