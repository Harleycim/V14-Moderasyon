const { Schema, model } = require('mongoose');

const BlacklistSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    reason: { type: String, default: null },
    moderatorId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = model('Blacklist', BlacklistSchema);
