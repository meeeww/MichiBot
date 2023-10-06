module.exports = async (client, interaction) => {
  if (!interaction.guild || !interaction.channel) return;

  const command = client.commands.get(interaction?.commandName);

  if (command) {
    if (command.BOT_PERMISSIONS) {
      if (!interaction.guild.members.me.permissions.has(command.BOT_PERMISSIONS))
        return interaction.reply({ content: `❌ No tengo permiso para usar este comando.`, ephemeral: true });
    }

    if (command.PERMISSIONS) {
      if (!interaction.member.permissions.has(command.PERMISSIONS))
        return interaction.reply({ content: `❌ No tienes permisos para usar este comando.`, ephemeral: true });
    }

    if (command.PERMISSIONS) {
      if (!interaction.member.permissions.has(command.PERMISSIONS))
        return interaction.reply({ content: `❌ No tienes permisos para usar este comando.`, ephemeral: true });
    }

    if (command.CMD.name != "gacha" && command.CMD.name != "info" && command.CMD.name == "balance") {
      if (interaction.user.id != 286402429258301440 && interaction.user.id != 293459020793249792) {
        return interaction.reply({ content: `❌ No tienes permisos para usar este comando.`, ephemeral: true });
      }
    } else {
      if (interaction.channel.id != 1159473413212094574 && interaction.guild.id != 1157517116551999550) {
        return interaction.reply({ content: `❌ No puedes usar este comando aquí.`, ephemeral: true });
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
