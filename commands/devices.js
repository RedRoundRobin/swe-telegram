require("dotenv").config();
const axios = require("axios");

const botDevices = (bot) => {
  bot.command("devices", (message) => {
    const buttonList = [];
    const getButtons = async () => {
      const response = await axios
        .get(`${process.env.URL_API}/devices`)
        .then((res) => {
          const devices = res.data;
          devices.forEach((device) => {
            buttonList.push([{ text: device.name, callback_data: "1" }]);
          });
        })
        .catch(() => {
          return reply.message("Errore caricamento lista dispositivi");
        });
      const buttonsData = await response;
      return buttonsData;
    };
    getButtons().then(() => {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: buttonList,
        }),
      };
      bot.telegram
        .sendMessage(message.chat.id, "Ecco la lista dei dispositivi:", options)
        .then(function (sended) {
          // `sended` is the sent message.
        });
    });
  });
};
module.exports.botDevices = botDevices;
