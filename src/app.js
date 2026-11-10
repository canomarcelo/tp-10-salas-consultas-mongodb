const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");
const { crearIdentificadorSolicitud, medirDuracion,} = require("./middleware/solicitudes");
const { crearManejadorErrores } = require("./middleware/errores");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterReservasApi } = require("./rutas/reservas-api");

function crearApp({ servicioReservas, formatoRegistro }) {
  const app = express();
  const controladorReservas = crearControladorReservas(servicioReservas); // controlador de reservas
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");
  app.use(morgan(formatoRegistro));
  app.use(crearIdentificadorSolicitud());
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Sistema de reservas" });
  });

  app.use("/reservas", crearRouterReservas(controladorReservas));
  app.use("/api/reservas", crearRouterReservasApi(controladorReservas));

  //app.use("/reservas", productosRouter);

  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "Ruta no encontrada." });
    }
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      cantidad: servicioReservas.listar().length,
      solicitudId: res.locals.solicitudId,
    });
  });

  app.use(
    crearManejadorErrores({
      vistaFormulario: "reservas/nueva",
      tituloFormulario: "Nueva reserva",
    }),
  );
  return app;
}
module.exports = { crearApp };
