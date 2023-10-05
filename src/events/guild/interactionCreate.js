module.exports = async (client, interaction) => {
  if (!interaction.guild || !interaction.channel) return;

  const command = client.commands.get(interaction?.commandName);

  if (command) {
    if (command.BOT_PERMISSIONS) {
      if (!interaction.guild.members.me.permissions.has(command.BOT_PERMISSIONS))
        return interaction.reply({ content: `❌ No tengo permiso para usar este comando.` });
    }

    if (command.PERMISSIONS) {
      if (!interaction.member.permissions.has(command.PERMISSIONS))
        return interaction.reply({ content: `❌ No tienes permisos para usar este comando.` });
    }

    if (command.PERMISSIONS) {
      if (!interaction.member.permissions.has(command.PERMISSIONS))
        return interaction.reply({ content: `❌ No tienes permisos para usar este comando.` });
    }

    if (command.CMD.name != "gacha") {
      if (interaction.user.id != 289258301440 && interaction.user.id != 293459020793249792) { //286402429258301440
        return interaction.reply({ content: `❌ No tienes permisos para usar este comando.` });
      }
    }

    try {
      command.execute(client, interaction, "/");
    } catch (e) {
      interaction.reply({
        content: `Ha ocurrido un error al ejecutar el comando.`,
      });
      console.log(e);
    }
  }
};
