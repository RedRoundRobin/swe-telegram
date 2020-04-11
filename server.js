require("dotenv").config();

// Richiesta per creazione server
const http = require("http");
// Richieste http
const axios = require("axios");

const tokenBot = process.env.BOT_TOKEN;

/**
 * Sending a message to a given Telegram chat id
 * @param {string} message
 * @param {string} chatId
 */
const sendMessage = (message, chatId) => {
  axios
    .post(
      `https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatId}&text=${message}`
    )
    .then((res) => {
      console.log("Messaggio inviato con successo");
      console.log(res.response.status);
      console.log(res.data);
      res.json("OK");
    })
    .catch((err) => {
      console.log(
        "Errore " + err.response.status + " nell'invio del messaggio"
      );
    });
};

const checkChatId = (chatId) => {
  const pattern = "^[0-9]{6,}$";
  const regex = new RegExp(pattern);
  return regex.test(chatId);
};

const botServer = http.createServer((req, res) => {
  // Request and Response object
  if (req.method === "POST") {
    let jsonRes = "";
    req.on("data", (data) => {
      jsonRes += data.toString();
      console.log(JSON.parse(jsonRes));
      const response = JSON.parse(jsonRes);
      if (response.reqType == "authentication") {
        const authCode = response.authCode;
        const chatId = response.chat_id;
        if (!checkChatId(chatId)) {
          console.log("Invalid chat id");
        } else {
          const authMessage = `Ecco il tuo codice di autenticazione: ${authCode}`;
          sendMessage(authMessage, chatId);
        }
      } else if (response.reqType == "alert") {
        const chatsId = response.chat_id;
        const deviceId = response.device_id;
        const sensorId = response.sensor_id;
        const sensorValue = response.sensor_value;
        const threshold = response.threshold;
        const valueType = response.value_type;
        const messagePart1 = `Attenzione: il sensore ${sensorId} del dispositivo ${deviceId} ha registrato un valore di `;
        const messagePart2 = `${sensorValue} ${valueType} superando la soglia (${threshold})`;
        const alertMessage = messagePart1 + messagePart2;
        // eslint-disable-next-line guard-for-in
        for (const index in chatsId) {
          const chatId = chatsId[index];
          if (!checkChatId(chatId)) {
            console.log("Invalid chat id");
          } else {
            sendMessage(alertMessage, chatId);
          }
        }
      }
    });
    req.on("end", () => {
      res.end("ok");
    });
  }
});
module.exports = { botServer, checkChatId, sendMessage };
