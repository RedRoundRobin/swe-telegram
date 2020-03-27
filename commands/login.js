// Richieste http
const axios = require("axios");

const botLogin = (bot) => {
    bot.command("login", (message) => {
        const username = message.from.username;
        const chatId = message.from.id;
        axios
            .post(`http://localhost:9999/auth/telegram`, {
                telegramName: username,
                telegramChat: chatId,
            })
            .then((res) => {
                const code = res.data.code;
                const token = res.data.token;

                if (code === 1) {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                    return message.reply("Username trovato, registrazione riuscita");
                } else if (code === 2) {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                    return message.reply(
                        "Account già registrato, nessuna modifica apportata"
                    );
                } else if (code === 0) {
                    return message.reply(
                        "Username non trovato, registra il tuo Username dalla web-app"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
                // console.log(err.status);
                if (err.response.status === 403) {
                    return message.reply(
                        "Rieffettua l'autenticazione usando il comando /login"
                    );
                } else {
                    return message.reply("Errore nel controllo dei dati");
                }
            });
    });
};
module.exports.botLogin = botLogin;