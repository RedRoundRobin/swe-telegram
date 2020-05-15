require("dotenv").config();
const http = require("http");
const axios = require("axios");

const sendMessage = (message, chatId) => {
  axios
    .get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      data: {
        chat_id: chatId,
        parse_mode: "markdown",
        text: message,
      },
    })
    .then((res) => {
      console.log("Messaggio inviato con successo: " + res.status);
      // console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
      console.log("Errore (" + err.response + ") nell'invio del messaggio");
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
          const authMessage = `\u{1F4F2} Ecco il tuo codice di autenticazione: ${authCode}`;
          sendMessage(authMessage, chatId);
        }
      } else if (response.reqType === "alert") {
        const chatIds = response.telegramChatIds;
        const threshold = response.currentThreshold;
        const sensorType = response.sensorType.replace(/_/g, "\\_");
        const deviceName = response.deviceName.replace(/_/g, "\\_");
        const gatewayName = response.realGatewayName; // .replace(/_/g, "\\_"); // Solo se non si usa `
        let valueType;
        switch (response.currentThresholdType) {
          case 0:
            valueType = "superiore (>)";
            break;
          case 1:
            valueType = "inferiore (<)";
            break;
          case 2:
            valueType = "uguale (=)";
            break;
        }
        const alertMessage = `\u{26A0}\u{FE0F} Alert #${response.alertId} \u{26A0}\u{FE0F}
- *Sensore:* ${sensorType} (S@${response.realSensorId}) 
- *Dispositivo:* ${deviceName} (D#${response.deviceId})
- *Gateway:* \`${gatewayName}\`
- *Valore:* ${response.currentValue} *${valueType}* alla soglia ${threshold}`;
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
