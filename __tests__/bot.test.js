// test bot
const { botStart } = require("../commands/start");
const { botInfo } = require("../commands/help");
const { botLogin } = require("../commands/login");
const { botStatus } = require("../commands/info");

const Telegraf = require("telegraf");
const tokenBot = process.env.BOT_TOKEN;
const bot = new Telegraf(tokenBot);

// LOGIN
test("Check login", () => {
  expect(botLogin(bot)).toBe(undefined);
});
// LAUNCH
test("Check status", () => {
  expect(botStatus(bot)).toBe(undefined);
});
// START
test("Check status", () => {
  expect(botStart(bot)).toBe(undefined);
});
// INFO
test("Check info", () => {
  expect(botInfo(bot)).toBe(undefined);
});
// const s = {"botLaunch": [Function botLaunch]`;
// const t = JSON.parse(s);
// test("Check launch", () => {
//   expect(botLaunch).toBe(t);
// });
