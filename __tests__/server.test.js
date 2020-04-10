const { sendMessage, checkChatId } = require("../server");


test("Send message to invalid chat id", () => {
  const message = "test";
  const chatId = "aaaaa";
  try {
    sendMessage(message, chatId);
  } catch (e) {
    expect(e.message).toBe("Request failed with status code 400");
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

test("Check valid chat id", () => {
  const validChatId = "148422328";
  expect(checkChatId(validChatId)).toBe(true);
});
