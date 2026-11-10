const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  res.locals.salas = salasPermitidas;
  res.locals.turnos = turnosPermitidos;
  next();
}

function validarReserva(req, res, next) {
  const datos = req.body ?? {};
  const estudiante =
    typeof datos.estudiante === "string" ? datos.estudiante.trim() : "";
  const email = typeof datos.email === "string" ? datos.email.trim() : "";
  const sala = typeof datos.sala === "string" ? datos.sala.trim() : "";
  const fecha = typeof datos.fecha === "string" ? datos.fecha.trim() : "";
  const turno = typeof datos.turno === "string" ? datos.turno.trim() : "";
  const cantidadPersonas = datos.personas;
  const TipoCantidadPersonas =
    typeof cantidadPersonas === "number" ||
    (typeof cantidadPersonas === "string" && cantidadPersonas.trim() !== "");
  const personas = TipoCantidadPersonas ? Number(datos.personas) : NaN;

  if ( !estudiante || !email || !email.includes("@") || !sala || !salasPermitidas.includes(sala) ||  !fecha ||  !turno ||!turnosPermitidos.includes(turno) ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    if (req.baseUrl === "/api/reservas") {
      return res.status(400).json({
        error: "Completá los campos con valores permitidos.",
        valores: req.body,
        salas: salasPermitidas,
        turnos: turnosPermitidos,
      });
    }

    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: "Completá todos los campos con valores permitidos.",
      valores: req.body,
      salas: salasPermitidas,
      turnos: turnosPermitidos,
    });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}

module.exports = { prepararAreaReservas, validarReserva };
