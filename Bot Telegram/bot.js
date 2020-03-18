//comandi telegram bot
const Telegraf = require('telegraf');
//richieste http
const axios = require('axios');
//tokenbot e crazione bot
const tokenBot = "1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c"
const bot = new Telegraf(tokenBot);

bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply(`Bevenuto nel bot di ThiReMa!Per vedere la lista del comandi che puoi utilizzare usa il comando /info `)
})

bot.command('login', message => {
  const url = message.message.text;
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
        return message.reply('Account trovato, registrazione riuscita');
      }
      if (data === 2) {
        return message.reply('Account già registrato, nessuna modifica apportata');
      }
      if (data === 0) {
        return message.reply('Account non trovato, registra il tuo account Telegram dalla web-app');
      }
    })
    .catch(err => {
      console.log(err);
      return message.reply('Errore nel controllo dei dati');
    });

});

bot.command('info', ({ reply }) => reply(`
  1) Login: /login
  `
))

bot.command('test', (message,token,chatID) => {
  token = 123456;
  chatID = 226026286;
  axios
    .post(`https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatID}&text=${token}`)
    //https://api.telegram.org/bot1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c/sendMessage?chat_id="226026285"&text="ciao"
    .then(res => {
      return message.reply('Token inviato');
    })
    .catch(err => {
      console.log(err);
      return message.reply(`Errore nell'invio del messaggio`);
    });
});
// bot.on('text', message => {
//   const url = message.message.text;
//   axios
//     .get(`https://www.redroundrobin.site/${url}`)
//     .then(res => {
//         const data = res.data.data;
//           return message.reply('Link esistente nel sito RedRoundRobin');
//     })
//     .catch (err => {
//     //console.log(err);
//     return message.reply('Errore nel caricamento dei dati');
//   });

// });
console.log('Bot avviato correttamente');
bot.launch();