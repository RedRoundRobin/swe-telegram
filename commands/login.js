const botLogin = (bot, axios, auth) => {
  bot.command("login", (message) => {
    auth.jwtAuth(axios, message, true);
  });
};
module.exports.botLogin = botLogin;
