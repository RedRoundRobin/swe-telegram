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
// function login(username, chatId) {
//     let mex ="";
//     axios
//         .get(`http://localhost:9999/login/${username}`)
//         .then(res => {
//             console.log(username);
//             console.log(chatId);
//             const data = res.data.toString();
//             let response = parse(data);
//             axios.defaults.headers.common[Authorization] = 'Bearer '+response.token;
//             let code = response.code;
//             if (code === 1) {
//                 mex +=  "Username trovato, registrazione riuscita";
//             }else if (code === 2) {
//                 mex += "Account già registrato, nessuna modifica apportata";
//             }else if (code === 0) {
//                 mex += "Username non trovato, registra il tuo Username dalla web-app";
//             }
//         })
//         .catch(err => {
//             // console.log("ERRORE")
//             // //console.log(err.status);
//             // if(true)
//             // {
//             //     mex = "Rieffettua l'autenticazione usando il comando /login";
//             // }else {
//             //     mex = 'Errore nel controllo dei dati';
//             // }
//             console.log("ERRORE");

//         });
//     return mex;
// }

const server = http.createServer((req, res) => { //request and response object
    if (req.method === 'POST') {
        let jsonRes = '';
        req.on('data', data => {
            jsonRes += data.toString();
            console.log(parse(jsonRes));
            let response = parse(jsonRes);
            let chatId = response.chat_id;
            let authCode = response.auth_code;
            axios
                .post(`https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatId}&text=${authCode}`)
                .then(res =>{console.log("Messaggio inviato con successo")})
                .catch(err => {console.log("Errore nell'invio del messaggio")});
        });
        req.on('end', () => {
            console.log(
                parse(jsonRes)
            );
            res.end('ok');
        });
        console.log(jsonRes);
    }
});

server.listen(3000, '127.0.0.1');
console.log('Server to port 3000');

    bot.start((message) => {
        console.log('started:', message.from.id);
        // const username = message.from.username;
        // const chatId = message.from.id;
        // let mex = login(username,chatId);
        return message.reply('Ciao '+message.from.first_name+', benvenuto nel bot di ThiReMa! Per vedere la lista del comandi che puoi utilizzare usa il comando /info ')
    });



bot.command('login', message => {
    //const url = message.message.text;
    const username = message.from.username;
    const chatId = message.from.id;
    axios
        .get(`http://localhost:9999/login/${username}`)
        .then(res => {
            const code = res.data.code;
            const token = res.data.token;
            axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
            if (code === 1) {
                return message.reply('Username trovato, registrazione riuscita');
            } else if (code === 2) {
                return message.reply('Account già registrato, nessuna modifica apportata');
            } else if (code === 0) {
                return message.reply('Username non trovato, registra il tuo Username dalla web-app');
            }
        })
        .catch(err => {
            console.log("ERRORE")
            //console.log(err.status);
            if(true) {
                mex = "Rieffettua l'autenticazione usando il comando /login";
            } else {
                mex = 'Errore nel controllo dei dati';
            }
        });
    });

      bot.command('status', message => {
          const username = message.from.username;

          axios
              .get(`http://localhost:9999/status/${username}`)
              .then(res => {
                  const data = res.data;
                  let userInfo = JSON.parse(data);

                  let name = userInfo.name;
                  let surname = userInfo.surname;
                  let email = userInfo.email;
                  let type = userInfo.type;
                  let code = userInfo.code;
                  let mex = "";
                  if (code === 0) {
                      mex = "Non hai attivato ancora l'autenticazione a due fattori nella web-app; usa /start non appena avrai fatto.";
                  } else if (code === 1) {
                      mex = "Hai attivato l'autenticazione a due fattori; usa /start per completare la procedura";
                  } else if (code === 2) {
                      mex = "L'autenticazione a due fattori è attiva";
                  }

                  return message.reply(`
                      1)Nome: ${name}
                      2)Cognome: ${surname}
                      3)Email: ${email}
                      4)Tipo: ${type}
                       ${mex}`);


              })
              .catch(err => {
                  if(err.response.status === 403)
                  {
                      message.reply("Rieffettua l'autenticazione usando il comando /login");
                  }else {
                      message.reply('Errore nel controllo dei dati');
                  }
              });
      });


    bot.command('info', ({ reply}) => reply(`
    1) Login: /login
    2) Status: /status`
    ));

    console.log('Bot avviato correttamente');
    bot.launch();


