// Richieste http
const axios = require("axios");

const botStatus = (bot) => {
    bot.command("status", (message) => {
        axios
            .get(`http://localhost:9999/status`)
            .then((res) => {
                const data = res.data;
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
                if (err.response.status === 403) {
                    message.reply("Rieffettua l'autenticazione usando il comando /login");
                } else {
                    message.reply("Errore nel controllo dei dati");
                }
            });
    });
};
module.exports.botStatus = botStatus;