require("dotenv").config();
const axios = require("axios");

const botCommands = [
  { command: "help", description: "Lista dei comandi del bot e informazioni" },
  { command: "login", description: "Avvio e autenticazione al sistema" },
  { command: "info", description: "Controllo delle informazioni dell'utente" },
  {
    command: "devices",
    description: "[Admin] Visualizza lista dispositivi a cui inviare input",
  },
];

axios
  .post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setMyCommands`, {
    commands: botCommands,
  })
  .then(() => {
    console.log("[Telegram] Info comandi caricati!");
  })
  .catch(() => {
    console.log("[Telegram] Errore caricamento comandi");
  });

module.exports.axios = axios;
