const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");

var config = require("../database/connection.js");
var connection = config.connection;

const ruleta = require("./crearRuleta.js");

async function buttonPages(interaction, pages, gachas, client) {
  //errores
  if (!interaction) throw new Error("Error. No hay interacción.");
  if (!pages) throw new Error("Error. No hay páginas.");
  if (!Array.isArray(pages)) throw new Error("Error. Las páginas tienen formato incorrecto.");

  //defer reply
  await interaction.deferReply();
  let sintickets = 0;

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

    if (i.user.id !== interaction.user.id) {
      return i.followUp({
        content: "No puedes usar este botón.",
        embeds: [],
        components: [],
        ephemeral: true,
      });
    }

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
                    let quedan = results[0]["tickets_restantes"] - precioGacha > 1 ? "quedan" : "queda";
                    let numero = Math.floor(Math.random() * 100) + 1;
                    let maximo = JSON.parse(gachas[index]["info"])["items"].length;
                    let premio = "Nada";
                    let icono = ":x:";
                    JSON.parse(gachas[index]["info"])["items"].forEach((item) => {
                      if (item["max"] >= numero && item["min"] <= numero) {
                        premio = item["nombre"];
                        icono = item["emoji"];
                      }
                    });
                    ruleta(
                      currentPage,
                      content,
                      results[0]["tickets_restantes"] - precioGacha,
                      interaction.user,
                      premio,
                      icono,
                      client,
                      quedan
                    );
                  } else {
                    console.log(error);
                  }
                }
              );
            } else {
              sintickets = sintickets + 1;
              return interaction.editReply({
                content: `**No tienes suficientes tickets.**`,
                components: [],
                embeds: [],
                ephemeral: true,
              });
            }
          } else {
            sintickets = sintickets + 1;
            return interaction.editReply({
              content: `**No tienes suficientes tickets.**`,
              components: [],
              embeds: [],
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

    if (!sintickets) {
      await currentPage.edit({
        embeds: [pages[index]],
        components: [buttonRow],
      });
    }

    collector.resetTimer();
  });

  const embedAbierto = new EmbedBuilder().setThumbnail(
    "https://cdn.discordapp.com/attachments/1157760445743124510/1158026261143224371/ezgif.com-resize.jpg?ex=651abf7f&is=65196dff&hm=9f0a66703e728c8c09d124e81477b2b3694e79e547ae99d2b35b5bf2df4881a6&"
  );
  embedAbierto.setColor(0x0099ff).setDescription(`Gracias por jugar <:timida:1106323964407578674>`);

  collector.on("end", async (i) => {
    await currentPage.edit({
      embeds: [embedAbierto],
      components: [],
    });
  });

  if (!sintickets) {
    return currentPage;
  }
}

module.exports = buttonPages;
