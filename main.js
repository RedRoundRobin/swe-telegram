require("dotenv").config();
const Telegraf = require("telegraf");

// Tokenbot e creazione bot
const tokenBot = process.env.BOT_TOKEN;
const bot = new Telegraf(tokenBot);

// Richiesta POST per settare i comandi
const axios = require("axios");
const botCommands = [
  { command: "info", description: "Comandi supportati" },
  { command: "login", description: "Autenticazione al sistema ThiReMa" },
  { command: "status", description: "Controllo dello status dell'utente" },
  { command: "dispositivi", description: "Visualizza lista dispositivi" },
];
axios
  .post(`https://api.telegram.org/bot${tokenBot}/setMyCommands`, {
    commands: botCommands,
  })
  .then(() => {
    console.log("Comandi caricati");
  })
  .catch(() => {
    console.log("Errore caricamento comandi");
  });

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
