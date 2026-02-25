const { Schema, model } = require('mongoose');

const GuildConfigSchema = new Schema(
  {
    guildId: { type: String, required: true, unique: true, index: true },

    logChannelId: { type: String, default: null },
    errorLogChannelId: { type: String, default: null },

    jailRoleId: { type: String, default: null },

    permissionLevels: {
      type: Map,
      of: [String],
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = model('GuildConfig', GuildConfigSchema);
