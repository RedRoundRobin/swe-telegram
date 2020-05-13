const axios = require("axios");

const botInfo = (bot, auth) => {
  bot.command("info", (message) => {
    const username = message.from.username;
    const axiosInstance = axios.create();
    const getUserInfo = async () => {
      await auth.jwtAuth(axiosInstance, message);
      return await axiosInstance
        .get(`${process.env.URL_API}/users?telegramName=${username}`)
        .then((res) => {
          const data = res.data[0];
          const name = data.name;
          const surname = data.surname;
          const email = data.email;
          const typeNumber = data.type;
          let type = "Utente";
          if (typeNumber === 1) {
            type = "Moderatore";
          } else if (typeNumber === 2) {
            type = "Amministratore";
          }
          return message.replyWithMarkdown(
            `
    Ecco i tuoi dati *${message.from.username}* \u{1F4DD}
    - *Nome:* ${name}
    - *Cognome:* ${surname}
    - *Email:* ${email}
    - *Tipo:* ${type}`
          );
        })
        .catch((err) => {
          console.log(err);
          message.reply("Errore nel controllo dei dati!");
        });
    };
    return getUserInfo();
  });
};
module.exports.botInfo = botInfo;
