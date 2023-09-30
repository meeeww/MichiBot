const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Recibe el ping del bot."),

  async execute(client, interaction) {
    return interaction.reply(`ms: **${client.ws.ping}**`);
  },
};
