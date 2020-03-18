//comandi telegram bot
const Telegraf = require('telegraf');
//richieste http
const axios = require('axios');
const bot = new Telegraf("1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c");

bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply(`Bevenuto nel bot di ThiReMa!Per vedere la lista del comandi che puoi utilizzare usa il comando /info `)
})

bot.command('login', ({ reply }) => reply('login'))

bot.command('info', ({ reply }) => reply(`
  1) Login: /login
  2) Dati dispositivo: /#numeroDispositivo
  3) Dati di un sensore: /#numeroDispositivo/#numeroSensore
  `))

bot.command('start', () => bot.lunch())

//bot.command('stop', () => bot.stop())

bot.on('text', message => {
  const url = message.message.text;
  axios
    .get(`https://www.redroundrobin.site/${url}`)
    .then(res => {
        const data = res.data.data;
          return message.reply('Link esistente nel sito RedRoundRobin');
    })
    .catch (err => {
    //console.log(err);
    return message.reply('Errore nel caricamento dei dati');
  });

});
console.log('Bot avviato correttamente');
bot.launch();

// const Telegraf = require('telegraf')
// const Extra = require('telegraf/extra')
// const Markup = require('telegraf/markup')

// const keyboard = Markup.inlineKeyboard([
//   Markup.loginButton('Login', 'http://domain.tld/hash', {
//     bot_username: 'my_bot',
//     request_write_access: 'true'
//   }),
//   Markup.urlButton('❤️', 'http://telegraf.js.org'),
//   Markup.callbackButton('Delete', 'delete')
// ])

// const bot = new Telegraf("1120382460:AAG2TTBT-GqHcIfGzH_TYOvCZFI0pMEu88c");
// bot.start((ctx) => ctx.reply('Hello', Extra.markup(keyboard)))
// bot.action('delete', ({ deleteMessage }) => deleteMessage())
// bot.launch()