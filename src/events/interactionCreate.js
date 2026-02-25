const { Events } = require('discord.js');
const { baseEmbed } = require('../utils/embed');
const { logger } = require('../utils/logger');
const { checkCooldown } = require('../utils/cooldown');
const { requireGuild } = require('../utils/validator');
const { sendErrorLog } = require('../modules/logging/services/log.service');
const Blacklist = require('../database/models/Blacklist');
const { getState } = require('../modules/admin/services/state.service');

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    try {
      if (interaction?.user?.id) {
        const state = await getState();
        const isOwner = Array.isArray(client?.config?.owners) && client.config.owners.includes(interaction.user.id);

        if (state?.maintenance && !isOwner) {
          if (interaction.isRepliable()) {
            await interaction.reply({ content: 'Bot bakım modunda.', ephemeral: true }).catch(() => null);
          }
          return;
        }

        const bl = await Blacklist.findOne({ userId: interaction.user.id });
        if (bl && !isOwner) {
          if (interaction.isRepliable()) {
            await interaction.reply({ content: 'Karalistede olduğun için bu botu kullanamazsın.', ephemeral: true }).catch(() => null);
          }
          return;
        }
      }

      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        const guildCheck = requireGuild(interaction);
        if (!guildCheck.ok) {
          await interaction.reply({ content: guildCheck.reason, ephemeral: true }).catch(() => null);
          return;
        }

        const cd = checkCooldown(client, interaction, command);
        if (!cd.ok) {
          await interaction.reply({ content: `Bu komutu tekrar kullanmak için ${cd.remaining}s bekle.`, ephemeral: true }).catch(() => null);
          return;
        }

        if (typeof command.checkPermission === 'function') {
          const perm = await command.checkPermission({ client, interaction });
          if (!perm?.ok) {
            await interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', ephemeral: true }).catch(() => null);
            return;
          }
        }

        await command.execute({ client, interaction });
        return;
      }

      if (interaction.isButton()) {
        let handler = client.buttons.get(interaction.customId);
        if (!handler && Array.isArray(client.buttonPrefixes)) {
          handler = client.buttonPrefixes.find((h) => typeof h.customId === 'string' && interaction.customId.startsWith(h.customId));
        }
        if (!handler) return;
        await handler.execute({ client, interaction });
        return;
      }

      if (interaction.isStringSelectMenu()) {
        let handler = client.selects.get(interaction.customId);
        if (!handler && Array.isArray(client.selectPrefixes)) {
          handler = client.selectPrefixes.find((h) => typeof h.customId === 'string' && interaction.customId.startsWith(h.customId));
        }
        if (!handler) return;
        await handler.execute({ client, interaction });
        return;
      }

      if (interaction.isModalSubmit()) {
        const handler = client.modals.get(interaction.customId);
        if (!handler) return;
        await handler.execute({ client, interaction });
      }
    } catch (err) {
      logger.error(`[INTERACTION_ERROR] ${err?.stack || err}`);

      const guildId = interaction?.guildId;
      if (guildId) {
        const embed = baseEmbed({
          title: 'Hata',
          description: `\`\`\`${String(err?.stack || err).slice(0, 3800)}\`\`\``
        });
        await sendErrorLog(client, guildId, embed);
      }

      const msg = 'Bir hata oluştu.';
      if (interaction?.deferred || interaction?.replied) {
        await interaction.followUp({ content: msg, ephemeral: true }).catch(() => null);
      } else {
        await interaction.reply({ content: msg, ephemeral: true }).catch(() => null);
      }
    }
  }
};
