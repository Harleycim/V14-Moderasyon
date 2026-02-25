const { Schema, model } = require('mongoose');

const RegisterConfigSchema = new Schema(
  {
    guildId: { type: String, required: true, unique: true, index: true },

    maleRoleId: { type: String, default: null },
    femaleRoleId: { type: String, default: null },
    unregisteredRoleId: { type: String, default: null },

    tag: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = model('RegisterConfig', RegisterConfigSchema);
