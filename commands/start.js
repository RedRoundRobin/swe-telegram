const botStart = (bot) => {
  bot.start((message) => {
    console.log("started:", message.from.id);
    const username = message.from.username;
    return message.replyWithMarkdown(`
Ciao *${username}*, benvenuto nel bot di ThiReMa!
Usa il comando /login per effettuare l'autenticazione.
Per vedere la lista del comandi che puoi utilizzare usa il comando /info`);
  });
};

module.exports.botStart = botStart;
