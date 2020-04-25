require("dotenv").config();
const axios = require("axios");

const botCommands = [
  { command: "info", description: "Lista dei comandi del bot e informazioni" },
  { command: "login", description: "Autenticazione al sistema" },
  { command: "status", description: "Controllo dello status dell'utente" },
  {
    command: "dispositivi",
    description: "[Admin] Visualizza lista dispositivi a cui inviare input",
  },
];

axios
  .post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setMyCommands`, {
    commands: botCommands,
  })
  .then(() => {
    console.log("Comandi caricati");
  })
  .catch(() => {
    console.log("Errore caricamento comandi");
  });
