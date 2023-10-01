const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

async function buttonPages(interaction, pages, time = 60000) {
  //errores
  if (!interaction) throw new Error("Error. No hay interacción.");
  if (!pages) throw new Error("Error. No hay páginas.");
  if (!Array.isArray(pages)) throw new Error("Error. Las páginas tienen formato incorrecto.");

  //defer reply
  await interaction.deferReply();

  //sin botrones si solo hay 1 pagina
  if (pages.length === 1) {
    const page = await interaction.editReply({
      embeds: pages,
      components: [],
      fetchReply: true,
    });

    return page;
  }

  //botones
  const prev = new ButtonBuilder().setCustomId("prev").setEmoji("⏪").setStyle(ButtonStyle.Secondary).setDisabled(true);
  const next = new ButtonBuilder().setCustomId("next").setEmoji("⏩").setStyle(ButtonStyle.Secondary);
  const abrir = new ButtonBuilder().setCustomId("abrir").setEmoji("🥸").setStyle(ButtonStyle.Success);

  const buttonRow = new ActionRowBuilder().addComponents(prev, abrir, next);
  let index = 0;

  const currentPage = await interaction.editReply({
    embeds: [pages[index]],
    components: [buttonRow],
    fetchReply: true,
  });

  //coleccion
  const collector = await currentPage.createMessageComponentCollector({
    ComponentType: ComponentType.Button,
    time,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id)
      return i.reply({
        content: "No puedes usar este botón.",
        ephemeral: true,
      });

    await i.deferUpdate();

    if (i.customId === "prev") {
      if (index > 0) index--;
    } else if (i.customId === "next") {
      if (index < pages.length - 1) index++;
    } else if (i.customId === "abrir") {
      console.log("abierto");
    }

    if (index === 0) prev.setDisabled(true);
    else prev.setDisabled(false);

    if (index === pages.length - 1) next.setDisabled(true);
    else next.setDisabled(false);

    await currentPage.edit({
      embeds: [pages[index]],
      components: [buttonRow],
    });

    collector.resetTimer();
  });

  collector.on("end", async (i) => {
    await currentPage.edit({
      embeds: [pages[index]],
      components: [],
    });
  });
  return currentPage;
}

module.exports = buttonPages;
