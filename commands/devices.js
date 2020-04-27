const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
let admin = false;

const botDevices = (bot, axios, auth) => {
  const deviceList = [];
  bot.command("devices", (message) => {
    const username = message.from.username;
    const getType = async () => {
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
    getType().then(() => {
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
              deviceList.push(
                Markup.callbackButton("bottone senza risposta", "ciaone")
              );
            })
            .catch(() => {
              admin = false;
            });
        };
        getButtons(message).then(() => {
          console.log("Lista dispositivi caricata correttamente");
          message.reply("", Markup.removeKeyboard(true));
          message.reply(
            "Ecco la lista dei dispositivi a quali puoi inviare un comando:",
            Markup.keyboard(deviceList).oneTime().resize().extra()
          );
        });
      }
    });
  });
  bot.hears(/^\d(_)(.*)$/gi, (message) => {
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
                `${sensor.sensorId}_${sensor.type}`,
                sensor.type
              )
            );
          });
        });
    };
    getButtons(message).then(() => {
      console.log("Lista sensori caricata correttamente");
      message.reply("", Markup.removeKeyboard(true));
      message.reply(
        "Seleziona il sensore:",
        Markup.keyboard(sensorsList).oneTime().resize().extra()
      );
      sensorsList = [];
    });
  });
};
module.exports.botDevices = botDevices;
