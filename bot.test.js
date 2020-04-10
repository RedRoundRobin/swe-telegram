// test bot
const { checkChatId, sendMessage } = require("./server");
const { botLogin } = require("./commands/login");
const bot = require("telegraf");

// CHATID TEST
// eslint-disable-next-line require-jsdoc
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const chatId = getRandomArbitrary(100000000, 999999999);
test("Chat id: ", () => {
  expect(checkChatId(chatId)).toBe(true);
});

// SEND MESSAGE TEST da cambiare undefined
test("sendMessage", () => {
  expect(sendMessage("ciao", "226026285")).toBe(undefined);
});

test("login", () => {
  expect(botLogin(bot)).toBe(undefined);
});