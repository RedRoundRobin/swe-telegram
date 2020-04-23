const botInfo = (bot) => {
  bot.command("info", ( message, { replyWithMarkdown } ) =>
      const chatId=message.chat.id;
    replyWithMarkdown(`
Ecco la lista dei comandi disponibili:
- Login: /login
- Status: /status
- Info: /info
sssss
  `)
  // let options = {
  //   reply_markup: JSON.stringify({
  //     inline_keyboard: [
  //       [{ text: 'OK 1', callback_data: '1' }],
  //       [{ text: 'OK 2', callback_data: '2' }],
  //       [{ text: 'OK 3', callback_data: '3' }]
  //     ]
  //   })
  // };
  // bot.sendMessage('Provaaaaa', chatId)
  //     .then( () => {
  //       console.log("OK")
  // });
};
module.exports.botInfo = botInfo;
