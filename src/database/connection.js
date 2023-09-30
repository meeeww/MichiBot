var mysql = require("mysql");

config = {
  host: "212.227.32.40",
  user: "michibot",
  password: "9(RDM]R]YGKa8lqK",
  database: "michi",
};
var connection = mysql.createConnection(config); //added the line
connection.connect(function (err) {
  if (err) {
    console.log("Error conectando:" + err.stack);
  }
  console.log("Conectado a la base de datos correctamente.");
});

module.exports = {
  connection: mysql.createConnection(config),
};