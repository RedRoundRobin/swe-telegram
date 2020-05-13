require("dotenv").config();
const http = require("http");
const axios = require("axios");

const sendMessage = (message, chatId) => {
  axios
    .post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${message}`
    )
    .then((res) => {
      console.log("Messaggio inviato con successo");
      console.log(res.status);
      console.log(res.data);
      res.json("OK");
    })
    .catch((err) => {
      console.log(err);
      console.log("Errore " + err.response + " nell'invio del messaggio");
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
      if (response.reqType === "authentication") {
        const authCode = response.authCode;
        const chatId = response.chatId;
        if (!checkChatId(chatId)) {
          console.log("Invalid chat id");
        } else {
          const authMessage = `Ecco il tuo codice di autenticazione: ${authCode}`;
          sendMessage(authMessage, chatId);
        }
      } else if (response.reqType === "alert") {
        const chatIds = response.telegramChatIds;
        const deviceId = response.realDeviceId;
        const sensorId = response.realSensorId;
        const sensorValue = response.currentValue;
        const threshold = response.currentThreshold;
        let valueType;
        switch (response.currentThresholdType) {
          case 0:
            valueType = "superiore";
            break;
          case 1:
            valueType = "inferiore";
            break;
          case 2:
            valueType = "uguale";
        }
        const messagePart1 = `Alert: il sensore S#${sensorId} del dispositivo D#${deviceId} ha registrato un valore di `;
        const messagePart2 = `${sensorValue} ${valueType} alla soglia (${threshold})`;
        const alertMessage = messagePart1 + messagePart2;
        // eslint-disable-next-line guard-for-in
        for (const index in chatIds) {
          const chatId = chatIds[index];
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
