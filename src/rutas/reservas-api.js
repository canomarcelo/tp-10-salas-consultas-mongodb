const express = require("express");
const { validarReserva } = require("../middleware/reservas");
const { validarReemplazoReserva , validarCambioParcial} = require("../middleware/cambios-reservas"); // nuevo middleware TP9

function crearRouterReservasApi(controlador) {
    const router = express.Router();
    router.get("/", controlador.listarReservaApi);
    router.get("/:id", controlador.obtenerReservaApi);
    router.post("/", validarReserva, controlador.crearReservaApi);

    router.delete("/:id", controlador.eliminarApi); // nuevo endpoint TP9

    router.put("/:id", validarReserva, validarReemplazoReserva,controlador.reemplazarApi); // nuevo endpoint TP9

    router.patch("/:id", validarCambioParcial, controlador.actualizarApi); // nuevo endpoint TP9

    return router;
}
module.exports = { crearRouterReservasApi };