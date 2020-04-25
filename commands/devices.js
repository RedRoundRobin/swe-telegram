const botDevices = (bot) => {
  bot.command("devices", (message) => {
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Accendi", callback_data: "1" }],
          [{ text: "Spegni", callback_data: "2" }],
          [{ text: "Esplodi", callback_data: "3" }],
        ],
      }),
    };
    bot.telegram
      .sendMessage(message.chat.id, "esempio bottoni", options)
      .then(function (sended) {
        // `sended` is the sent message.
      });
  });
};
module.exports.botDevices = botDevices;
