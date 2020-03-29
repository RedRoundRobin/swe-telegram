// Richiesta per creazione server
const http = require("http");
// Richieste http
const axios = require("axios");
const tokenBot = process.env.BOT_TOKEN;
exports.botServer = http.createServer((req, res) => {
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
      } else if (response.reqType == "alert") {
        const chatsId = response.chat_id;
        const deviceId = response.device_id;
        const sensorId = response.sensor_id;
        const sensorValue = response.sensor_value;
        const threshold = response.threshold;
        const valueType = response.value_type;
        const message1 = `Attenzione: il sensore ${sensorId} del dispositivo ${deviceId} ha registrato un valore di `;
        const message2 = `${sensorValue} ${valueType} superando la soglia (${threshold})`;
        // eslint-disable-next-line guard-for-in
        for (const index in chatsId) {
          console.log(chatsId[index]);
          const chatId = chatsId[index];
          axios
            .post(
              `https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatId}&text=` +
                message1 +
                message2
            )
            .then(() => {
              console.log("Messaggio inviato con successo");
            })
            .catch((err) => {
              console.log("Errore: " + err + " nell'invio del messaggio");
            });
        }
      }
    });
    req.on("end", () => {
      res.end("ok");
    });
  }
});
