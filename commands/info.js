const botInfo = (bot) => {
  bot.command("info", ({ replyWithMarkdown }) => {
    replyWithMarkdown(`
RIoT Bot 
--------
Ecco la lista dei comandi disponibili:
- /login - primo avvio e registrazione account
- /status - informazioni utente corrente
- /info - queste informazioni
- /devices - dispositivi a cui è possibile inviare input
  `);
  });
};
module.exports.botInfo = botInfo;
