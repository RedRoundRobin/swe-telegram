let admin = false;

const callBackFunction = (message, bot) => {
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
    .sendMessage(message.chat.id, "Scegli l'opzione", options)
    .then(function (sended) {
      // `sended` is the sent message.
      console.log("FATTO");
    })
    .catch(() => {
      console.log("Errore nell'invio del messaggio");
    });
};

const botDevices = (bot, axios, auth) => {
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
        const buttonList = [];
        const getButtons = async () => {
          return await axios
            .get(`${process.env.URL_API}/devices`)
            .then((res) => {
              admin = true;
              const devices = res.data;
              devices.forEach((device) => {
                buttonList.push([
                  {
                    text: device.name,
                    callback_query: "1",
                  },
                ]);
              });
            })
            .catch(() => {
              admin = false;
            });
        };
        getButtons().then(() => {
          const options = {
            reply_markup: JSON.stringify({
              keyboard: buttonList,
              one_time_keyboard: true,
              resize_keyboard: true,
              callback_data: "click",
            }),
          };
          bot.telegram
            .sendMessage(
              message.chat.id,
              "Ecco la lista dei dispositivi",
              options
            )
            .then((sent) => {
              // sent is the message
            });
        });
      }
    });
  });
  bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    console.log("sono qui")
    bot.telegram
      .answerCallbackQuery(callbackQuery.id)
      .then(() => bot.sendMessage(msg.chat.id, "You clicked!"));
  });
};
module.exports.botDevices = botDevices;
