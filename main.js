require("dotenv").config();
const Telegraf = require("telegraf");

// Tokenbot e creazione bot
const tokenBot = process.env.BOT_TOKEN;
const bot = new Telegraf(tokenBot);

// eslint-disable-next-line no-unused-vars
const { botServer } = require("./server");
const botLaunch = require("./commands/launch");
const botStart = require("./commands/start");
const botInfo = require("./commands/info");
const botLogin = require("./commands/login");
const botStatus = require("./commands/status");
const botDispositivi = require("./commands/dispositivi");
// const botStart = require("./commands");

// Comandi bot
botStart.botStart(bot);
botInfo.botInfo(bot);
botLogin.botLogin(bot);
botStatus.botStatus(bot);
botDispositivi.botDispositivi(bot);

botServer.listen(3000);
console.log("Server to port 3000");

botLaunch.botLaunch(bot);
console.log("Bot avviato correttamente");
