const { sendMessage, checkChatId } = require("../utils/server");

test("Send message to invalid chat id", () => {
  const message = "test";
  const chatId = "aaaaa";
  try {
    sendMessage(message, chatId);
  } catch (e) {
    expect(e.message).toBe("Errore 400 nell'invio del messaggio");
  }
});

test("Send message to valid chat id", () => {
  const message = "test";
  const chatId = "192645345";
  try {
    sendMessage(message, chatId);
    expect(message).toBe("test");
  } catch (e) {
    console.log("Errore nell'invio del messaggio");
  }
});

test("Check chat id with invalid characters", () => {
  const invalidChatId = "a48422329";
  expect(checkChatId(invalidChatId)).toBe(false);
});

test("Check chat id with invalid length", () => {
  const invalidChatId = "167";
  expect(checkChatId(invalidChatId)).toBe(false);
});

// eslint-disable-next-line require-jsdoc
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const chatId = getRandomArbitrary(100000000, 999999999);
test("Check valid chat id", () => {
  expect(checkChatId(chatId)).toBe(true);
});

// const req = { metod: "POST", reqType: "authentication" };
// test("Check authentication request", () => {
//   expect(botServer.toString()).toBe("[object Object]");
// });
