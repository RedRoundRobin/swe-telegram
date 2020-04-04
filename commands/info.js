const botInfo = (bot) => {
    bot.command("info", ({ replyWithMarkdown }) =>
        replyWithMarkdown(`
Ecco la lista dei comandi disponibili:
- Login: /login
- Status: /status
- Info: /info`
        )
    );
};
module.exports.botInfo = botInfo;