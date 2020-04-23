const axios = require("axios");
const Telegram = require("telegraf/telegram");
const telegram = new Telegram("1120382460:AAGy8CdhjdMxaS99K3za1Jxoqp-ayPuVC1w");
const botDispositivi = (bot) => {
  bot.command("dispositivi", (message) => {
    axios
      .get(
        "https://api.telegram.org/bot1120382460:AAGy8CdhjdMxaS99K3za1Jxoqp-ayPuVC1w/getMyCommands"
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch(() => {
        console.log("errore caricamento dati");
      });
  });
};
module.exports.botDispositivi = botDispositivi;
