//comandi telegram bot
const Telegraf = require('telegraf');
//richieste http
const axios = require('axios');
//tokenbot e creazione bot
const tokenBot = "1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c";
const bot = new Telegraf(tokenBot);
//richiesta per creazione server
const http = require('http');
//
const {parse} = require('querystring');


// function sum(a, b) {
//     return a + b;
// }
// module.exports = sum;

const server = http.createServer((req, res) => { //request and response object
    if (req.method === 'POST') {
        let jsonRes = '';
        req.on('data', data => {
            jsonRes += data.toString();
        });
        req.on('end', () => {
            console.log(
                parse(jsonRes)
            );
            res.end('ok');
        });
        console.log(jsonRes);
    }
    console.log("asaas");
    bot.start((message) => {
        console.log('started:', message.from.id);
        //http.
        return message.reply('Ciao '+message.from.first_name+', benvenuto nel bot di ThiReMa! Per vedere la lista del comandi che puoi utilizzare usa il comando /info ')
    });

    bot.command('login', message => {
        //const url = message.message.text;
        const username = message.from.username;
        const chatId = message.from.id;
        axios
        .get(`http://localhost:9999/login/${username}`)
        .then(res => {
            console.log(username);
            console.log(chatId);
            const data = res.data;
            console.log(data);
            if (data === 1) {
            return message.reply('Username trovato, registrazione riuscita');
            }else if (data === 2) {
            return message.reply('Account già registrato, nessuna modifica apportata');
            }else if (data === 0) {
            return message.reply('Username non trovato, registra il tuo Username dalla web-app');
            }
        })
        .catch(err => {
            console.log(err);
            return message.reply('Errore nel controllo dei dati');
        });
    });
    res.render
    // bot.command('status', message => {
    //     const username = message.from.username;

    //     axios
    //         .get(`http://localhost:9999/status/${username}`)
    //         .then(res => {
    //             const data = res.data;
    //             let userInfo = JSON.parse(data);

    //             let name = userInfo.name;
    //             let surname = userInfo.surname;
    //             let email = userInfo.email;
    //             let type = userInfo.type;
    //             let code = userInfo.code;
    //             let mex = "";
    //             if (code === 0) {
    //                 mex = "Non hai attivato ancora l'autenticazione a due fattori nella web-app; usa /start non appena avrai fatto.";
    //             } else if (code === 1) {
    //                 mex = "Hai attivato l'autenticazione a due fattori; usa /start per completare la procedura";
    //             } else if (code === 2) {
    //                 mex = "L'autenticazione a due fattori è attiva";
    //             }

    //             return message.replyWithHTML('<ul>' +
    //                 '<li>' + name + '</li>' +
    //                 '<li>' + surname + '</li>' +
    //                 '<li>' + email + '</li>' +
    //                 '<li>' + type + '</li>' +
    //                 '<li>' + mex + '</li>' +
    //                 '</ul> ');


    //         })
    //         .catch(err => {
    //             console.log(err);
    //             return message.reply('Errore nel controllo dei dati');
    //         });
    // });

    bot.command('info', ({ reply }) => reply(`
        1) Login: /login
        `
     ));

    bot.command('test', (message,token,chatID) => {
        token = 123456;
        chatID = 226026286;
        axios
        .post(`https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatID}&text=${token}`)
        //https://api.telegram.org/bot1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c/sendMessage?chat_id="226026285"&text="ciao"
        .then(res => {
            console.log(res);
            return message.reply('Token inviato');
        })
        .catch(err => {
            console.log(err);
            return message.reply(`Errore nell'invio del messaggio`);
        });
    });
    console.log('Bot avviato correttamente');
    bot.launch();
});
server.listen(3000, '127.0.0.1');
console.log('Server to port 3000');