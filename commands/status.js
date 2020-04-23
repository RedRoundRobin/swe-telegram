const botStatus = (bot, axios) => {
  bot.command("status", (message) => {
    const username = message.from.username;
    console.log(username);
    axios
      .get(`${process.env.LINK_API}/users?telegramName=` + username)
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
    Ecco i tuoi dati *${message.from.username}*
    - *Nome:* ${name}
    - *Cognome:* ${surname}
    - *Email:* ${email}
    - *Tipo:* ${type}`
        );
      })
      .catch((err) => {
        if (err.response != null && err.response.status === 403) {
          message.reply(
            "Effettua prima l'autenticazione usando il comando /login"
          );
        } else {
          message.reply("Errore nel controllo dei dati");
        }
      });
  });
};
module.exports.botStatus = botStatus;
