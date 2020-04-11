require("dotenv").config();

// Richiesta per creazione server
const http = require("http");
// Richieste http
const axios = require("axios");
// TokenBot
const tokenBot = process.env.BOT_TOKEN;

exports.botServer = http.createServer((req, res) => {
  // Request and Response object
  if (req.method === "POST") {
    let jsonRes = "";
    req.on("data", (data) => {
      jsonRes += data.toString();
      console.log(JSON.parse(jsonRes));
      const response = JSON.parse(jsonRes);
      const chatId = response.chat_id;
      const authCode = response.auth_code;
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
