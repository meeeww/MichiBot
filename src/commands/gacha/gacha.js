const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

var config = require("../../database/connection.js");
var connection = config.connection;

const buttonPages = require("../../functions/buttonPages.js");

module.exports = {
  CMD: new SlashCommandBuilder().setName("gacha").setDescription("Abrir una gacha."),

  async execute(client, interaction) {
    connection.query("SELECT * FROM gachas", function (error, results) {
      if (results) {
        let pages = [];
        let objecto;
        let gachas = [];
        results.forEach((gacha) => {
          let stringItems = "";
          gachas = results
          objecto = JSON.parse(gacha["info"]);
          objecto["items"].map((item) => {
            stringItems =
              stringItems +
              (item.emoji + ":\t" + "**" + item.nombre + "**" + ` ${"``" + (item.max - item.min) + "%``"}`) +
              "\n";
          });
          let precio = objecto.precio
          let content =
          objecto.precio > 1 ? "tickets" : "ticket";
          const embed1 = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(objecto.nombre)
            .setDescription(stringItems)
            .setThumbnail(
              "https://cdn.discordapp.com/attachments/1157760445743124510/1158026261143224371/ezgif.com-resize.jpg?ex=651abf7f&is=65196dff&hm=9f0a66703e728c8c09d124e81477b2b3694e79e547ae99d2b35b5bf2df4881a6&"
            )
            .setFooter({ text: "Coste por tirada: " + precio.toString() + " " + content });
          pages.push(embed1);
        });
        buttonPages(interaction, pages, gachas, client);
      } else {
        console.log(error);
      }
    });
  },
};
