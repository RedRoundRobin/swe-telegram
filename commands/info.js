
const botInfo = (bot) => {
  bot.command("info", ({ replyWithMarkdown }) => {
    replyWithMarkdown(`
Ecco la lista dei comandi disponibili:
- Login: /login
- Status: /status
- Info: /info
- Lista dispositivi: /dispositivi
  `);
  });
};
module.exports.botInfo = botInfo;
