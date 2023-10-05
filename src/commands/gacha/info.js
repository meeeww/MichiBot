const { SlashCommandBuilder } = require("discord.js");

var config = require("../../database/connection.js");
var connection = config.connection;

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Poner la información del bot."),

  async execute(client, interaction) {
    return interaction.reply({
      content: `**• Por cada 10€ de compra recibirás un ticket que podrás usar en los diferentes gachapones disponibles en el canal <#1159473413212094574> \n\n～NO aplica ninguna compra anterior al día 05/10/2023\n～SOLO para compras de 10€ o más, si haces dos compras de 5 en días diferentes, no recibirás ningún ticket.\n～Si compras 30€ por ejemplo, recibirás 3 tickets.\n～Todos los premios obtenidos serán publicados en <#1159446362040057856>**`,
      ephemeral: true,
    });
  },
};
