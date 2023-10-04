const { EmbedBuilder } = require("discord.js");

let colorIndex = 0;
let indexMax = 0;
let tiempo = 500;

var config = require("../database/connection.js");
var connection = config.connection;

async function ruleta(currentPage, singular, ticketsRestantes, user, premio, icono, client, quedan) {
  const embedAbierto = new EmbedBuilder()
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/1157760445743124510/1158026261143224371/ezgif.com-resize.jpg?ex=651abf7f&is=65196dff&hm=9f0a66703e728c8c09d124e81477b2b3694e79e547ae99d2b35b5bf2df4881a6&"
    )
    .setFooter({ text: `Te ${quedan} ${ticketsRestantes} ${singular}.` });
  let colors = ["#ffff00", "#008000", "#ff1917"];

  embedAbierto.setColor(colors[colorIndex]).setDescription("1...");
  nuevo(embedAbierto, colors, currentPage, user, premio, icono, client);
  return currentPage.edit({
    embeds: [embedAbierto],
    components: [],
    ephemeral: false,
  });
}

function nuevo(embedAbierto, colors, currentPage, user, premio, icono, client) {
  if (indexMax >= 3) {
    indexMax = 0;
    if (premio == "Nada") {
      embedAbierto.setColor(0x0099ff).setDescription(`Lo sentimos ${user.globalName}, no hubo suerte...`);
    } else {
      let emojis = ["<a:cat_music:1100253056177811557>", "<a:parrotdance:1129235206050684999>"];
      let numero = Math.floor(Math.random() * emojis.length);
      client.channels.cache
        .get("1158487449568292954")
        .send(`¡**<@${user.id}>** ha ganado ${icono} __${premio}__! ${emojis[numero]}`);
      if (premio.includes("Ticket")) {
        connection.query(
          "UPDATE tickets t1 INNER JOIN tickets t2 ON t1.id_usuario <= t2.id_usuario  LEFT OUTER JOIN tickets t3 ON t2.id_usuario < t3.id_usuario  SET t1.tickets_totales = t1.tickets_totales + ?, t1.tickets_restantes = t1.tickets_restantes + ? WHERE t1.id_usuario = ? AND t3.id_usuario IS NULL",
          [parseInt(premio.charAt(0)), parseInt(premio.charAt(0)), user.id],
          function (error2, results2) {
            if (results2) {
              console.log(results2)
            } else {
              console.log(error2);
            }
          }
        );
      }
      embedAbierto.setColor(0x0099ff).setDescription(`Enhorabuena ${user.globalName}, has ganado ${premio}`);
    }
  } else {
    if (colorIndex == 2) {
      colorIndex = 0;
    } else {
      colorIndex++;
    }
    setTimeout(function () {
      embedAbierto.setColor(colors[colorIndex]).setDescription(indexMax.toString() + "...");
      nuevo(embedAbierto, colors, currentPage, user, premio, icono, client);
      return currentPage.edit({
        embeds: [embedAbierto],
        components: [],
        ephemeral: false,
      });
    }, tiempo);
  }
  indexMax++;
}

module.exports = ruleta;
