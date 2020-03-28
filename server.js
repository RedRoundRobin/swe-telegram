// Richiesta per creazione server
const http = require("http");
// Richieste http
const axios = require("axios");

exports.botServer = http.createServer((req, res) => {
  // Request and Response object
  if (req.method === "POST") {
    let jsonRes = "";
    req.on("data", (data) => {
      jsonRes += data.toString();
      console.log(JSON.parse(jsonRes));
      const response = JSON.parse(jsonRes);
      const chatId = response.chat_id;
      if (response.req_type == "authentication") {
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
      } else if (response.req_type == "alert") {
        const deviceId = response.device_id;
        const sensorId = response.sensor_id;
        const sensorValue = response.sensor_value;
        const threshold = response.threshold;
        const valueType = response.value_type;

        const message1 = `⚠️ Il sensore ${sensorId} del dispositivo ${deviceId} ha registrato un valore di `;
        const message2 = `${sensorValue} ${valueType} superando la soglia di ${threshold}`;
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
            console.log(
              "Errore " + err.response.status + " nell'invio del messaggio"
            );
          });
      }
    });
    req.on("end", () => {
      console.log(JSON.parse(jsonRes));
      res.end("ok");
    });
    console.log(jsonRes);
  }
});
