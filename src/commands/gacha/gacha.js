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
        results.forEach((gacha, index) => {
          //console.log(JSON.parse(gacha["info"])["items"]);
          console.log(gacha)
          let stringItems = "";
          let objecto = JSON.parse(gacha["info"])
          objecto["items"].map((item) => {
            stringItems = stringItems + (item.nombre + ` ${"``" + item.porcentaje + "%``"}`) + "\n";
          });
          console.log(objecto)
          const embed1 = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(objecto.nombre)
            .setDescription(stringItems)
            .setThumbnail(
              "https://cdn.discordapp.com/attachments/1157760445743124510/1158026261143224371/ezgif.com-resize.jpg?ex=651abf7f&is=65196dff&hm=9f0a66703e728c8c09d124e81477b2b3694e79e547ae99d2b35b5bf2df4881a6&"
            );
          pages.push(embed1);
        });
        buttonPages(interaction, pages);
      } else {
        console.log(error);
      }
    });

    const embed1 = new EmbedBuilder().setColor(0x0099ff).setTitle("2").setDescription("hola2");
    const embed2 = new EmbedBuilder().setColor(0x0099ff).setTitle("2").setDescription("hola2");
    const embed3 = new EmbedBuilder().setColor(0x0099ff).setTitle("3").setDescription("hola3");

    const pages = [embed1, embed2, embed3];
  },
};
