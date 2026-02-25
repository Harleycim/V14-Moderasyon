const { Schema, model } = require('mongoose');

const BotStateSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    maintenance: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = model('BotState', BotStateSchema);
