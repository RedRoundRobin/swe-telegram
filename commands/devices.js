const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
let admin = false;

const botDevices = (bot, axios, auth) => {
  let deviceList = [];
  bot.command("devices", (message) => {
    const username = message.from.username;
    const getType = async () => {
      await auth.jwtAuth(axios, message);
      return await axios
        .get(`${process.env.URL_API}/users?telegramName=${username}`)
        .then((res) => {
          const data = res.data[0];
          const typeNumber = data.type;
          if (typeNumber === 2) {
            admin = true;
          } else {
            admin = false;
            return message.reply(
              "Devi essere amministratore per vedere la lista dispositivi"
            );
          }
        })
        .catch(() => {
          admin = false;
          return message.reply(`Esegui di nuovo il comando /login`);
        });
    };
    getType().then(() => {
      if (admin) {
        const getButtons = async () => {
          return await axios
            .get(`${process.env.URL_API}/devices`)
            .then((res) => {
              admin = true;
              const devices = res.data;
              devices.forEach((device) => {
                deviceList.push(
                  Markup.callbackButton(
                    "device_" + device.name,
                    device.name
                  )
                );
              });
              deviceList.push(Markup.callbackButton("bottone senza risposta", "ciaone"));
            })
            .catch(() => {
              admin = false;
            });
        };
        getButtons().then(() => {
          console.log("Lista dispositivi caricata correttamente");
        });
      }
    });

    return message.reply(
      "random example",
      Markup.keyboard(deviceList)
        .oneTime()
        .resize()
        .extra()
    );
    // console.log(deviceList);
    // reply(
    //   "Seleziona il dispositivo a cui inviare un comando",
    //   Markup.keyboard(deviceList).oneTime().resize().extra()
    // );
    deviceList = [];
    // bot.action("WATER-MACHINE", (ctx, next) => {
    //   return ctx
    //     .reply(
    //       "Seleziona il sensore",
    //       Extra.markup(Markup.keyboard(["sensore1", "sensore2", "sensore3"]))
    //     )
    //     .then(() => next());
    // })

    // bot.hears("WATER-MACHINE", (ctx) => {
    //   return ctx.reply(
    //     "Seleziona il sensore",
    //     Extra.markup(Markup.keyboard(["sensore1", "sensore2", "sensore3"]))
    //   );
    // });
  });
  bot.hears(/^(device_)(.*)$/gi, (ctx) => {
    console.log("Robe");
    /* return ctx
      .reply(
        "Seleziona il sensore:",
        Extra.markup(Markup.keyboard(["sensore1", "sensore2", "sensore3"]))
      )
      .then(() => next());
       */

    return ctx.reply(`Oh, ` + ctx.match[0] + ` Great choice`);
  });
};
module.exports.botDevices = botDevices;
