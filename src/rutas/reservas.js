const express = require("express");

const {  prepararAreaReservas,  validarReserva, } = require("../middleware/reservas");

function crearRouterReservas(controladorReservas) {
  const router = express.Router();
  router.use(prepararAreaReservas);
  router.get("/", controladorReservas.listar);
  router.get("/nueva", controladorReservas.mostrarFormulario);
  router.get("/:id", controladorReservas.mostrarDetalle);
  router.post("/", validarReserva, controladorReservas.crear);

  router.delete("/eliminar/:id", controladorReservas.eliminar); // nuevo endpoint TP9 - Desde html

  return router;
}
module.exports = { crearRouterReservas };
