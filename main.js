const { axios } = require("./utils/config");
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

const botServer = require("./utils/server");
const cmdStart = require("./commands/start");
const cmdInfo = require("./commands/info");
const cmdLogin = require("./commands/login");
const cmdStatus = require("./commands/status");
const cmdDevices = require("./commands/devices");

cmdStart.botStart(bot);
cmdInfo.botInfo(bot);
cmdLogin.botLogin(bot, axios);
cmdStatus.botStatus(bot, axios);
cmdDevices.botDevices(bot);

botServer.listen(process.env.SERVER_PORT);
console.log(
  "[Telegram] Server di ascolto per API avviato (porta " +
    process.env.SERVER_PORT +
    ")"
);

bot.launch();
console.log("[Telegram] Bot avviato!");
