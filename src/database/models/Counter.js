const { Schema, model } = require('mongoose');

const CounterSchema = new Schema(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    key: { type: String, required: true, default: 'case' },
    seq: { type: Number, default: 0 }
  },
  { timestamps: true }
);

CounterSchema.index({ guildId: 1, key: 1 }, { unique: true });

module.exports = model('Counter', CounterSchema);
