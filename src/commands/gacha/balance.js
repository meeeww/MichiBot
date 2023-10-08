const { SlashCommandBuilder } = require("discord.js");

var config = require("../../database/connection.js");
var connection = config.connection;

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Ver tickets de a un usuario.")
    .addUserOption((option) =>
      option.setName("usuario").setDescription("Usuario").setRequired(true)
    ),

  async execute(client, interaction) {
    const target = interaction.options.getUser("usuario");

    console.log(interaction.user.id)

    if (!target.bot || !target.system) {
      connection.query(
        "SELECT * FROM tickets WHERE id_usuario = ?",
        [target.id],
        function (error, results) {
          if (results) {
            if (results.length) {
              let content =
                results[0]["tickets_restantes"] > 1 ? "tickets restantes" : "ticket restante";
                let content2 = results[0]["tickets_totales"] > 1 ? `fueron ${results[0]["tickets_totales"]} tickets` : `fue ${results[0]["tickets_totales"]} ticket`;
              return interaction.reply({
                content: `**${target.globalName}** tiene ${results[0]["tickets_restantes"]} ${content}. Su total ${content2}.`,
                ephemeral: false,
              });
            } else {
              return interaction.reply({
                content: `**${target.globalName}** no tiene ningún ticket.`,
                ephemeral: false,
              });
            }
          } else {
            console.log(error);
          }
        }
      );
    } else {
      return interaction.reply({
        content: `No puedes darle tickets a un bot.`,
        ephemeral: false,
      });
    }
  },
};
