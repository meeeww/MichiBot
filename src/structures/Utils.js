const { glob } = require("glob");
const { promisify } = require("util");
const proGlob = promisify(glob);

module.exports = class BotUtils {
  //archivo para actualizar bot siempre que se guarda un nuevo archivo
  constructor(client) {
    this.client = client;
  }

  async loadFiles(dirName) {
    const files = await proGlob(
      `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
    );

    files.forEach((file) => {
      delete require.cache[require.resolve(file)];
    });
    return files;
  }
};
