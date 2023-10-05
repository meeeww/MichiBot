const { SlashCommandBuilder } = require("discord.js");

var config = require("../../database/connection.js");
var connection = config.connection;

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Poner la información del bot."),

  async execute(client, interaction) {
    return interaction.reply({
      content: `**El servidor ha sido ligeramente actualizado tanto visualmente como en algunas mecánicas, aquí os dejo el resumen: \n\n1. Se ha añadido el canal de <#1159457794215391242>, cualquier persona puede dejar sus ideas ahí para el servidor y se tendrán en cuenta\n\n2. El canal de memes ha sido eliminado, los memes ahora al ⁠<#1111073079356051466> :P\n\n3. Se ha añadido el nuevo sistema de recompensas con el nuevo <@1157517646674268221>, la mecánica es la siguiente:\n\n• Por cada 10€ de compra recibirás un ticket que podrás usar en los diferentes gachapones disponibles en el canal <#1159473413212094574> \n\n～NO aplica ninguna compra anterior al día 05/10/2023\n～SOLO para compras de 10€ o más, si haces dos compras de 5 en días diferentes, no recibirás ningún ticket.\n～Si compras 30€ por ejemplo, recibirás 3 tickets.\n～Todos los premios obtenidos serán publicados en <#1159446362040057856> \n\n4. Los precios de los orbes y el pase serán publicados en los próximos días, habrá descuento por compras grandes.**`,
      ephemeral: true,
    });
  },
};
