const axios = require("axios");
const Telegram = require("telegraf/telegram");
const telegram = new Telegram("1120382460:AAGy8CdhjdMxaS99K3za1Jxoqp-ayPuVC1w");
const botDispositivi = (bot) => {
  bot.command("dispositivi", (message) => {
    // axios
    //     //   .get(
    //     //     "https://api.telegram.org/bot1120382460:AAGy8CdhjdMxaS99K3za1Jxoqp-ayPuVC1w/getMyCommands"
    //     //   )
    //     //   .then((res) => {
    //     //     console.log(res.data);
    //     //   })
    //     //   .catch(() => {
    //     //     console.log("errore caricamento dati");
    //     //   });
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Accendi", callback_data: "A1" },
            { text: "Spegni", callback_data: "C1" },
          ],
        ],
      },
    };
    bot.telegram.sendMessage(message.from.id, "Message text", opts);
  });
};
module.exports.botDispositivi = botDispositivi;
