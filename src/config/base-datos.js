const mongoose = require("mongoose");
const dns = require("node:dns");
const { leerUriMongo } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]); // Configura los servidores DNS para la resolucion de nombres

async function conectarBaseDatos() {
  // conexion a la base de datos

  await mongoose.connect(leerUriMongo(), {
    serverSelectionTimeoutMS: 5000,
  });
}
async function desconectarBaseDatos() {
  // desconexion de la base de datos

  await mongoose.disconnect();
}
module.exports = { conectarBaseDatos, desconectarBaseDatos };
