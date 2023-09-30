const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");
const BotUtils = require("./Utils");

module.exports = class extends Client {
  constructor(
    options = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
      ],

      allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
      },

      presence: {
        activities: [
          {
            name: process.env.STATUS,
            type: ActivityType[process.env.STATUS_TYPE],
          },
        ],
        status: PresenceUpdateStatus.Online,
      },
    }
  ) {
    super({
      ...options,
    });

    this.commands = new Collection();
    this.commandsArray = [];

    this.utils = new BotUtils(this);

    this.start();
  }

  async start() {
    await this.loadHandlers();
    await this.loadEvents();
    await this.loadCommands();

    this.login(process.env.BOT_TOKEN);
  }

  async loadCommands() {
    console.log(`(>>) Cargando comandos.`);
    await this.commands.clear();
    this.commandsArray = [];

    const fileDirectories = await this.utils.loadFiles("/src/commands");

    if (fileDirectories.length) {
      fileDirectories.forEach((fileDirectory) => {
        try {
          const command = require(fileDirectory);
          const commandName = fileDirectory
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          command.CMD.name = commandName;

          if (commandName) this.commands.set(commandName, command);

          this.commandsArray.push(command.CMD.toJSON());
        } catch (e) {
          console.log(`Error al cargar el archivo ${fileDirectory}`);
          console.log(e);
        }
      });
    }

    console.log(`(>>) ${this.commands.size} comandos cargados.`);

    if (this?.application?.commands) {
        this.application.commands.set(this.commandsArray);
        console.log(`(>>) ${this.commands.size} comandos publicados.`);
      }
  }

  async loadHandlers() {
    console.log(`(>>) Cargando handlers.`);

    const fileDirectories = await this.utils.loadFiles("/src/handlers");

    if (fileDirectories.length) {
      fileDirectories.forEach((fileDirectory) => {
        try {
          require(fileDirectory)(this);
        } catch (e) {
          console.log(`Error al cargar el archivo ${fileDirectory}`);
          console.log(e);
        }
      });
    }

    console.log(`(>>) ${fileDirectories.length} handlers cargados.`);
  }

  async loadEvents() {
    console.log(`(>>) Cargando eventos.`);
    const fileDirectories = await this.utils.loadFiles("/src/events");
    this.removeAllListeners();

    if (fileDirectories.length) {
      fileDirectories.forEach((fileDirectory) => {
        try {
          const event = require(fileDirectory);
          const eventName = fileDirectory
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];

          this.on(eventName, event.bind(null, this));
        } catch (e) {
          console.log(`Error al cargar el archivo ${fileDirectory}`);
          console.log(e);
        }
      });
    }

    console.log(`(>>) ${fileDirectories.length} eventos cargados.`);
  }
};
