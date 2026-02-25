const { loadCommandHandler } = require('./commandHandler');
const { loadEventHandler } = require('./eventHandler');
const { loadButtonHandler } = require('./buttonHandler');
const { loadModalHandler } = require('./modalHandler');
const { loadSelectHandler } = require('./selectHandler');
const { loadPrefixCommandHandler } = require('./prefixCommandHandler');

async function registerHandlers(client) {
  await loadCommandHandler(client);
  await loadPrefixCommandHandler(client);
  await loadButtonHandler(client);
  await loadSelectHandler(client);
  await loadModalHandler(client);
  await loadEventHandler(client);
}

module.exports = { registerHandlers };
