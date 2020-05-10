const botHelp = (bot) => {
  bot.command("help", ({ replyWithMarkdown }) => {
    replyWithMarkdown(`
*RIoT - Telegram Bot* 

\u{2753} Ecco la lista dei comandi disponibili:

- /help - informazioni di supporto (corrente)
- /login - primo avvio e registrazione account
- /info - informazioni utente corrente
- /devices - dispositivi a cui è possibile inviare input

*Procedura di autenticazione Telegram*

1. Accedere alla web-app
2. Spostarsi nella sezione *impostazioni*
3. Compilare il campo Telegram nel primo modulo delle impostazioni
4. Tornare al bot Telegram
5. Eseguire il comando /login 

In caso di problemi con la procedura, contattare il proprio moderatore ente.
  `);
  });
};
module.exports.botHelp = botHelp;
