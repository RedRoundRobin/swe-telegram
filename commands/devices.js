require("dotenv").config();
const axios = require("axios");
let admin = false;

const callBackFunction = (message,bot) => {
  console.log(message.chat.id);
  const options = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: "Attiva sensore", callback_data: "1" }],
        [{ text: "Disattiva sensore", callback_data: "2" }],
      ],
    }),
  };
  console.log(options);
  bot.telegram
    .sendMessage(message.chat.id, "Segli l'opzione", options)
    .then(function (sended) {
      // `sended` is the sent message.
      console.log("FATTO");
    })
    .catch(() => {
      console.log("Errore");
    });
};

const botDevices = (bot) => {
  let message2;
  bot.command("devices", (message) => {
    message2=message;
    const username = message.from.username;
    const getType = async () => {
      const resType = await axios
        .get(`${process.env.URL_API}/users?telegramName=${username}`)
        .then((res) => {
          const data = res.data[0];
          const typeNumber = data.type;
          if (typeNumber === 2) {
            admin = true;
            console.log("IS ADMIN");
          } else {
            admin = false;
            return message.reply(
              "Devi essere amministratore per vedere la lista dispositivi"
            );
          }
        })
        .catch((err) => {
          admin = false;
          return message.reply(`Esegui di nuovo il comando /login`);
        });
      const typeUser = await resType;
      return typeUser;
    };
    getType().then(() => {
      console.log(getType());
      if (admin) {
        const buttonList = [];
        const getButtons = async () => {
          const response = await axios
            .get(`${process.env.URL_API}/devices`)
            .then((res) => {
              admin = true;
              const devices = res.data;
              devices.forEach((device) => {
                buttonList.push([
                  { text: device.name, callback_data: "callBackFunction(message2,bot)" },
                ]);
              });
            })
            .catch(() => {
              admin = false;
            });
          const buttonsData = await response;
          return buttonsData;
        };
        getButtons().then(() => {
          const options = {
            reply_markup: JSON.stringify({
              keyboard: buttonList,
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
      }
    });
  });
};
module.exports.botDevices = botDevices;
