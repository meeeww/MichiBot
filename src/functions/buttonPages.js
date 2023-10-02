const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");

var config = require("../database/connection.js");
var connection = config.connection;

const ruleta = require("./crearRuleta.js");

async function buttonPages(interaction, pages, gachas) {
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
  const abrir = new ButtonBuilder().setCustomId("abrir").setLabel("Abrir").setEmoji("🎉").setStyle(ButtonStyle.Success);

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
    time: 60000,
  });

  collector.on("collect", async (i) => {
    await i.deferUpdate();

    if (i.user.id !== interaction.user.id)
      return i.editReply({
        content: "No puedes usar este botón.",
        components: [buttonRow],
        ephemeral: true,
      });

    if (i.customId === "prev") {
      if (index > 0) index--;
    } else if (i.customId === "next") {
      if (index < pages.length - 1) index++;
    } else if (i.customId === "abrir") {
      connection.query("SELECT * FROM tickets WHERE id_usuario = ?", [interaction.user.id], function (error, results) {
        if (results) {
          if (results.length) {
            let precioGacha = JSON.parse(gachas[index]["info"])["precio"];
            if (results[0]["tickets_restantes"] >= precioGacha) {
              connection.query(
                "UPDATE `tickets` SET `tickets_restantes` = ? WHERE `id_usuario` = ?",
                [results[0]["tickets_restantes"] - precioGacha, interaction.user.id],
                function (error, results2) {
                  if (results2) {
                    let content = results[0]["tickets_restantes"] - precioGacha > 1 ? "tickets" : "ticket";
                    let numero = Math.floor(Math.random() * 100) + 1;
                    let maximo = JSON.parse(gachas[index]["info"])["items"].length;
                    let premio = "Nada";
                    JSON.parse(gachas[index]["info"])["items"].forEach((item) => {
                      if (item["max"] >= numero && item["min"] <= numero) {
                        premio = item["nombre"];
                      }
                    });

                    ruleta(
                      currentPage,
                      content,
                      results[0]["tickets_restantes"] - precioGacha,
                      interaction.user,
                      premio
                    );
                  } else {
                    console.log(error);
                  }
                }
              );
            } else {
              console.log("sin tickets");
            }
          } else {
            return interaction.editReply({
              content: `No tienes ningún ticket.`,
              components: [],
              ephemeral: true,
            });
          }
        } else {
          console.log(error);
        }
      });
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
