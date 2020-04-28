const axios = require("axios");
const Markup = require("telegraf/markup");

const botDevices = (bot, auth) => {
  bot.command("devices", (message) => {
    const username = message.from.username;
    const axiosInstance = axios.create();
    let admin = false;
    let deviceList = [];
    const getDeviceList = async () => {
      await auth.jwtAuth(axiosInstance, message);
      await axiosInstance
        .get(`${process.env.URL_API}/users?telegramName=${username}`)
        .then((res) => {
          const data = res.data[0];
          const typeNumber = data.type;
          if (typeNumber === 2) {
            admin = true;
          } else {
            admin = false;
            return message.reply(
              "Devi essere amministratore per vedere la lista dispositivi"
            );
          }
        });
      if (admin) {
        await axiosInstance
          .get(`${process.env.URL_API}/devices`)
          .then((res) => {
            admin = true;
            const devices = res.data;
            devices.forEach((device) => {
              deviceList.push(
                Markup.callbackButton(
                  `${device.deviceId}_${device.name}`,
                  device.name
                )
              );
            });
          });
      }
    };

    if (deviceList.length > 0) {
      getDeviceList()
        .then(() => {
          console.log("Lista dispositivi caricata correttamente");
          Markup.removeKeyboard();
          message.reply(
            "Seleziona il dispositivo a cui inviare un comando:",
            Markup.keyboard(deviceList).oneTime().resize().extra()
          );
          deviceList = [];
        })
        .catch(() => {
          message.reply(
            "Errore, non hai i permessi per eseguire questa azione, oppure il servizio non è al momento disponibile."
          );
        });
    }

    // user has selected to switch on one sensor
    bot.hears(/^\d{1,2}(_)+\d{1,2}(_)(Attiva)/g, (message) => {
      const devSensID = message.match[0].match(/\d/gi);
      Markup.removeKeyboard();
      message.reply(
        `Il sensore @${devSensID[1]} del dispositivo @${devSensID[0]} è stato attivato con successo!`
      );
    });
    // user has selected to switch off one sensor
    bot.hears(/^\d{1,2}(_)+\d{1,2}(_)(Disattiva)/g, (message) => {
      const devSensID = message.match[0].match(/\d/gi);
      Markup.removeKeyboard();
      message.reply(
        `Il sensore @${devSensID[1]} del dispositivo @${devSensID[0]} è stato disattivato con successo!`
      );
    });
    // user has selected one sensor
    bot.hears(/^\d{1,2}(_)+\d{1,2}(_)(.*)/g, (message) => {
      const sensorID = message.match[0].match(/\d/gi);
      Markup.removeKeyboard();
      message.reply(
        "Seleziona l'opzione:",
        Markup.keyboard([
          `${sensorID[0]}_${sensorID[1]}_Attiva`,
          `${sensorID[0]}_${sensorID[1]}_Disattiva`,
        ])
          .oneTime()
          .resize()
          .extra()
      );
    });
    // user has selected one device
    bot.hears(/^\d{1,2}(_)(.*)/g, (message) => {
      const deviceID = message.match[0].match(/^\d/gi);
      let sensorsList = [];
      const axiosInstance = axios.create();
      const getButtons = async () => {
        await auth.jwtAuth(axiosInstance, message);
        return axiosInstance
          .get(`${process.env.URL_API}/devices/${deviceID}/sensors`)
          .then((res) => {
            const sensors = res.data;
            sensors.forEach((sensor) => {
              sensorsList.push(
                Markup.callbackButton(
                  `${deviceID}_${sensor.sensorId}_${sensor.type}`,
                  sensor.type
                )
              );
            });
          });
      };
      getButtons(message).then(() => {
        console.log("Lista sensori caricata correttamente");
        Markup.removeKeyboard();
        message.reply(
          "Seleziona il sensore:",
          Markup.keyboard(sensorsList).oneTime().resize().extra()
        );
        sensorsList = [];
      });
    });
  });
};
module.exports.botDevices = botDevices;
