require("./utils/config");
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

const { botServer } = require("./utils/server");
const auth = require("./utils/auth");
const cmdStart = require("./commands/start");
const cmdHelp = require("./commands/help");
const cmdLogin = require("./commands/login");
const cmdInfo = require("./commands/info");
const cmdDevices = require("./commands/devices");

cmdStart.botStart(bot);
cmdHelp.botHelp(bot);
cmdLogin.botLogin(bot, auth);
cmdInfo.botInfo(bot, auth);
cmdDevices.botDevices(bot, auth);

botServer.listen(process.env.SERVER_PORT);
console.log(
  "[Telegram] Server di ascolto per API avviato (porta " +
    process.env.SERVER_PORT +
    ")"
);

bot.launch();
console.log("[Telegram] Bot avviato!");
