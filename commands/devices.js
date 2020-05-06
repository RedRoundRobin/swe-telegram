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
          .get(`${process.env.URL_API}/devices?cmdEnabled=true`)
          .then((res) => {
            const devices = res.data;
            devices.forEach((device) => {
              deviceList.push(
                Markup.callbackButton(
                  `${device.name}-D#${device.deviceId}`,
                  device.name
                )
              );
            });
            deviceList.push(Markup.callbackButton("Annulla \u{274C}"));
          });
      }
    };

    getDeviceList()
      .then(() => {
        if (deviceList.length !== 0) {
          message.reply(
            "Seleziona il dispositivo a cui inviare un comando:",
            Markup.keyboard(deviceList).oneTime().resize().extra()
          );
          deviceList = [];
        }
      })
      .catch(() => {
        message.reply(
          "Errore, non hai i permessi per eseguire questa azione, oppure il servizio non è al momento disponibile."
        );
      });

    // user has selected one device
    bot.hears(/^(.*)(-)(D#\d{1,11})$/g, (message) => {
      const deviceID = message.match[0].match(/(\d{1,11})$/g);
      let sensorsList = [];
      const axiosInstance = axios.create();
      const getButtons = async () => {
        await auth.jwtAuth(axiosInstance, message);
        return axiosInstance
          .get(
            `${process.env.URL_API}/devices/${deviceID}/sensors?cmdEnabled=true`
          )
          .then((res) => {
            const sensors = res.data;
            sensors.forEach((sensor) => {
              sensorsList.push(
                Markup.callbackButton(
                  `${sensor.type}-D#${deviceID}-S#${sensor.sensorId}`,
                  sensor.type
                )
              );
            });
            sensorsList.push(Markup.callbackButton("Annulla \u{274C}"));
          });
      };
      getButtons().then(() => {
        Markup.removeKeyboard();
        message.reply(
          "Seleziona il sensore:",
          Markup.keyboard(sensorsList).oneTime().resize().extra()
        );
        sensorsList = [];
      });
    });

    // user has selected one sensor
    bot.hears(/^(.*)(-)(D#\d{1,11})(-)(S#\d{1,11})$/g, (message) => {
      const deviceSensorID = message.match[0].match(/(#\d{1,11})/gi);
      message.reply(
        "Seleziona un input da inviare al comando:",
        Markup.keyboard([
          `\u{1F7E2} Attiva_D${deviceSensorID[0]}-S${deviceSensorID[1]}`,
          `\u{1F534} Disattiva_D${deviceSensorID[0]}-S${deviceSensorID[1]}`,
          `Annulla \u{274C}`,
        ])
          .oneTime()
          .resize()
          .extra()
      );
    });
    // user has selected to switch on one sensor
    bot.hears(
      /^(.*)(Attiva|Disattiva)(_)(D#\d{1,11})(-)(S#\d{1,11})$/g,
      (message) => {
        const action = message.match[0].match(/(Attiva|Disattiva)/g)[0];
        const deviceID = message.match[0].match(/(\d{1,11})/gi)[0];
        const sensorID = message.match[0].match(/(\d{1,11})$/gi);
        const axiosInstance = axios.create();
        const sendCommandToAPI = async (realCommand) => {
          await auth.jwtAuth(axiosInstance, message);
          await axiosInstance
            .put(`${process.env.URL_API}/sensors/${sensorID}`, {
              data: realCommand,
            })
            .then((res) => {
              message.reply(
                `\u{2705} Hai richiesto ${
                  action === "Attiva" ? "l'attivazione" : "la disattivazione"
                } del sensore #${sensorID} del dispositivo #${deviceID}`,
                Markup.removeKeyboard().extra()
              );
            })
            .catch((err) => {
              message.reply(
                `[Errore] La richiesta *non* è andata a buon fine. La configurazione potrebbe essere cambiata. Riprova.`,
                Markup.removeKeyboard().extra());
            });
        };
        switch (action) {
          case "Attiva":
            sendCommandToAPI(1);
            break;
          case "Disattiva":
            sendCommandToAPI(0);
            break;
        }
      }
    );

    // user has selected to switch off one sensor
    bot.hears(/(Annulla .*)/g, (message) => {
      message.reply(`Operazione annullata`, Markup.removeKeyboard().extra());
    });
  });
};
module.exports.botDevices = botDevices;
