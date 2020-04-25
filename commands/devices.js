require("dotenv").config();
const axios = require("axios");
let admin = false;

const botDevices = (bot) => {
  bot.command("devices", (message) => {
    const username = message.from.username;
    const getType = async () => {
      const resType = await axios
        .get(`${process.env.URL_API}/users?telegramName=${username}`)
        .then((res) => {
          const data = res.data[0];
          const typeNumber = data.type;
          if (typeNumber === 2) {
            admin = true;
            console.log("IS admin");
          }
          else {
            admin = false;
            console.log("IS not admin");
          }
        })
        .catch(() => {
          return message.reply(`Errore verifica account, esegui il comando /login`);
        });
      const typeUser = await resType;
      return typeUser;
    };
    getType().then(() => {
      if (admin) {
        const buttonList = [];
        const getButtons = async () => {
          const response = await axios
            .get(`${process.env.URL_API}/devices`)
            .then((res) => {
              admin = true;
              const devices = res.data;
              devices.forEach((device) => {
                buttonList.push([{ text: device.name, callback_data: "1" }]);
              });
            })
            .catch((err) => {
              admin = false;
              return message.reply("Devi essere un amministratore");
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
            .sendMessage(
              message.chat.id,
              "Ecco la lista dei dispositivi",
              options
            )
            .then(function (sended) {
              // `sended` is the sent message.
            });
        });
      } else {
        return message.reply("Devi essere un amministratore");
      }
    });
  });
};
module.exports.botDevices = botDevices;
