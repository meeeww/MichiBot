module.exports = (client) => {
  console.log(`Sesión iniciada como ${client.user.tag}`);

  if (client?.application?.commands) {
    client.application.commands.set(client.commandsArray);
    console.log(`(>>) ${client.commands.size} comandos publicados.`);
  }
};
