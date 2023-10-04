const { SlashCommandBuilder } = require("discord.js");

var config = require("../../database/connection.js");
var connection = config.connection;

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Añadir tickets a un usuario.")
    .addUserOption((option) => option.setName("usuario").setDescription("Usuario").setRequired(true))
    .addIntegerOption((option) => option.setName("tickets").setDescription("Número de tickets").setRequired(true)),

  async execute(client, interaction) {
    const target = interaction.options.getUser("usuario");
    const tickets = interaction.options.getInteger("tickets");

    if (!target.bot || !target.system) {
      connection.query("SELECT * FROM tickets WHERE id_usuario = ?", [target.id], function (error, results) {
        if (results) {
          if (results.length) {
            connection.query(
              "UPDATE `tickets` SET `tickets_totales` = ?, `tickets_restantes` = ? WHERE `id_usuario` = ?",
              [results[0]["tickets_totales"] + tickets, results[0]["tickets_restantes"] + tickets, target.id],
              function (error2, results2) {
                if (results2) {
                  let content = tickets > 1 ? "tickets" : "ticket";
                  return interaction.reply({
                    content: `Le has dado ${tickets} ${content} a ${target.globalName}. Ahora tiene ${
                      results[0]["tickets_restantes"] + tickets
                    } ${content}.`,
                    ephemeral: false,
                  });
                } else {
                  console.log(error2);
                }
              }
            );
          } else {
            console.log(target)
            connection.query(
              "INSERT INTO `tickets` (`id_usuario`, `nombre_usuario`, `tickets_totales`, `tickets_restantes`) VALUES (?, ?, ?, ?)",
              [target.id, target.username, tickets, tickets],
              function (error2, results2) {
                if (results2) {
                  if(results[0] != undefined){
                    let content = results[0]["tickets_restantes"] > 1 ? "tickets" : "ticket";
                    return interaction.reply({
                      content: `Le has dado ${tickets} ${content} a **${target.globalName}**. Ahora tiene ${
                        results[0]["tickets_restantes"] + tickets
                      } ${content}.`,
                      ephemeral: false,
                    });
                  }
                } else {
                  console.log(error2);
                }
              }
            );
          }
        } else {
          console.log(error);
        }
      });
    } else {
      return interaction.reply({
        content: `No puedes darle tickets a un bot.`,
        ephemeral: false,
      });
    }
  },
};
