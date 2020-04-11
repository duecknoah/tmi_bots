const tmi = require('tmi.js');
const Store = require('data-store');

const botStore = new Store({
  path: "bots.json"
});

const defaultOptions = {
  options: {
    debug: false,
  },
  connection: {
    cluster: 'aws',
    reconnect: true,
  },
  identity: {
    username: "defaultUser",
    password: "defaultPass",
  },
  channels: botStore.get('channels')
};

const bots = botStore.get('bots');
const botGoal = bots.length;
let botCount = 0;

for (let bot of Object.values(bots)) {
  // Copy default options, apply bot specific options, and start client
  let botOptions = JSON.parse(JSON.stringify(defaultOptions));
  botOptions.identity.username = bot.username;
  botOptions.identity.password = bot.password;

  let client = new tmi.client(botOptions);
  client.connect();
  client.on('connected', (address, port) => {
    console.log(`*** ${bot.username} connected ***`);
    botCount ++;

    if (botCount === botGoal) {
      console.log(`*** All ${botGoal} bots connected to the following channels: ${defaultOptions.channels}! ***`);
    }
  });
}