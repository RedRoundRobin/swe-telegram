const Markup = require("telegraf/markup");
// const Extra = require("telegraf/extra");
let admin = false;

const botDevices = (bot, axios, auth) => {
  let deviceList = [];
  bot.command("devices", (message) => {
    const username = message.from.username;
    const getTypeUser = async () => {
      await auth.jwtAuth(axios, message);
      return await axios
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
        })
        .catch(() => {
          admin = false;
          return message.reply(`Esegui di nuovo il comando /login`);
        });
    };
    getTypeUser().then(() => {
      if (admin) {
        const getButtons = async () => {
          return await axios
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
              // deviceList.push(
              //   Markup.callbackButton("bottone senza risposta", "ciaone")
              // );
            })
            .catch(() => {
              admin = false;
            });
        };
        getButtons(message).then(() => {
          console.log("Lista dispositivi caricata correttamente");
          Markup.removeKeyboard();
          message.reply(
            "Seleziona il dispositivo a cui inviare un comando:",
            Markup.keyboard(deviceList).oneTime().resize().extra()
          );
          deviceList = [];
        });
      }
    });
  });
  // user has selected to switch on one sensor
  bot.hears(/^\d(_)+\d(_)(Attiva)/g, (message) => {
    const devSensID = message.match[0].match(/\d/gi);
    Markup.removeKeyboard();
    message.reply(
      `Il sensore ${devSensID[1]} del dispositivo ${devSensID[0]} è stato attivato con successo!`
    );
  });
  // user has selected to switch off one sensor
  bot.hears(/^\d(_)+\d(_)(Disattiva)/g, (message) => {
    const devSensID = message.match[0].match(/\d/gi);
    Markup.removeKeyboard();
    message.reply(
      `Il sensore ${devSensID[1]} del dispositivo ${devSensID[0]} è stato disattivato con successo!`
    );
  });
  // user has selected one sensor
  bot.hears(/^\d(_)+\d(_)(.*)/g, (message) => {
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
  bot.hears(/^\d(_)(.*)/g, (message) => {
    const deviceID = message.match[0].match(/^\d/gi);
    let sensorsList = [];
    const getButtons = async () => {
      return axios
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
};
module.exports.botDevices = botDevices;
