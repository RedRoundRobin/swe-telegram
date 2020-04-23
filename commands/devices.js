const botDevices = (bot) => {
  bot.command("devices", (message) => {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Accendi", callback_data: "A1" },
            { text: "Spegni", callback_data: "C1" },
          ],
        ],
      },
    };
    bot.telegram.sendMessage(message.from.id, "Message text", opts);
  });
};
module.exports.botDevices = botDevices;
