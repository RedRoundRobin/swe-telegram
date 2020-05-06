const axios = require("axios");

const botLogin = (bot, auth) => {
  bot.command("login", (message) => {
    const axiosInstance = axios.create();
    auth.jwtAuth(axiosInstance, message, true);
  });
};
module.exports.botLogin = botLogin;
