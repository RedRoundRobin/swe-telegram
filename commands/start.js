const botStart = (bot) => {
  bot.start((message) => {
    console.log("started:", message.from.id);
    const username = message.from.username;
    return message.replyWithMarkdown(`
Ciao *${username}*, benvenuto nel RIoT bot! \u{1F47E}
Usa il comando /login per effettuare l'autenticazione.
Se hai bisogno di aiuto digita il comando /help`);
  });
};

module.exports.botStart = botStart;
