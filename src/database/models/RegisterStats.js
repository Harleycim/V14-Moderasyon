const { Schema, model } = require('mongoose');

const RegisterStatsSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    registrarId: { type: String, required: true, index: true },

    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

RegisterStatsSchema.index({ guildId: 1, registrarId: 1 }, { unique: true });

module.exports = model('RegisterStats', RegisterStatsSchema);
