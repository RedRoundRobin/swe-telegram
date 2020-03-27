require("dotenv").config();
// Comandi telegram bot
const Telegraf = require("telegraf");
// Richieste http
const axios = require("axios");

// tokenbot e creazione bot
const tokenBot = process.env.BOT_TOKEN;
const bot = new Telegraf(tokenBot);

const server = require("./botServer");

server.listen(3000, "127.0.0.1");
console.log("Server to port 3000");

bot.start((message) => {
  console.log("started:", message.from.id);
  const username = message.from.username;
  return message.replyWithMarkdown(
    `
Ciao *${username}*, benvenuto nel bot di ThiReMa!
Usa il comando /login per effettuare l'autenticazione.
Per vedere la lista del comandi che puoi utilizzare usa il comando /info
`
  );
});

bot.command("login", (message) => {
  const username = message.from.username;
  const chatId = message.from.id;
  axios
    .post(`http://localhost:9999/auth/telegram`, {
      telegramName: username,
      telegramChat: chatId,
    })
    .then((res) => {
      const code = res.data.code;
      const token = res.data.token;

      if (code === 1) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return message.reply("Username trovato, registrazione riuscita");
      } else if (code === 2) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return message.reply(
          "Account già registrato, nessuna modifica apportata"
        );
      } else if (code === 0) {
        return message.reply(
          "Username non trovato, registra il tuo Username dalla web-app"
        );
      }
    })
    .catch((err) => {
      console.log(err);
      // console.log(err.status);
      if (err.response.status === 403) {
        return message.reply(
          "Rieffettua l'autenticazione usando il comando /login"
        );
      } else {
        return message.reply("Errore nel controllo dei dati");
      }
    });
});

bot.command("status", (message) => {
  axios
    .get(`http://localhost:9999/status`)
    .then((res) => {
      const data = res.data;
      const name = data.name;
      const surname = data.surname;
      const email = data.email;
      const typeNumber = data.type;
      let type = "Utente";
      if (typeNumber === 1) {
        type = "Moderatore";
      } else if (typeNumber === 2) {
        type = "Amministratore";
      }
      return message.replyWithMarkdown(
        `
Ecco i tuoi dati *${message.from.username}*
- *Nome:* ${name}
- *Cognome:* ${surname}
- *Email:* ${email}
- *Tipo:* ${type}`
      );
    })
    .catch((err) => {
      if (err.response.status === 403) {
        message.reply("Rieffettua l'autenticazione usando il comando /login");
      } else {
        message.reply("Errore nel controllo dei dati");
      }
    });
});

bot.command("info", ({ replyWithMarkdown }) =>
  replyWithMarkdown(
    `
Ecco la lista dei comandi disponibili:
- Login: /login
- Status: /status
- Info: /info`
  )
);

console.log("Bot avviato correttamente");
bot.launch();
