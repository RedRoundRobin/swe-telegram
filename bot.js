// Comandi telegram bot
const Telegraf = require("telegraf");
// Richieste http
const axios = require("axios");
// Tokenbot e creazione bot
const tokenBot = "1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c";
const bot = new Telegraf(tokenBot);
// Richiesta per creazione server
const http = require("http");
const { parse } = require("querystring");

const server = http.createServer((req, res) => {
  // Request and response object
  if (req.method === "POST") {
    let jsonRes = "";
    req.on("data", (data) => {
      jsonRes += data.toString();
      console.log(JSON.parse(jsonRes));
      let response = JSON.parse(jsonRes);
      let chatId = response.chat_id;
      let authCode = response.auth_code;
      axios
        .post(
          `https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatId}&text=Ecco il tuo codice di autenticazione: ${authCode}`
        )
        .then(() => {
          console.log("Messaggio inviato con successo");
        })
        .catch((err) => {
          console.log(
            "Errore " + err.response.status + " nell'invio del messaggio"
          );
        });
    });
    req.on("end", () => {
      console.log(JSON.parse(jsonRes));
      res.end("ok");
    });
    console.log(jsonRes);
  }
});

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
      //console.log(err.status);
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
