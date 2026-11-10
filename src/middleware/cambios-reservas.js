
function validarReemplazoReserva(req, res, next) {
    
    const datos = req.body;
    
    const permitidos = [ "estudiante", "email", "sala", "fecha",  "turno", "personas", "estado"];
    
    
    for (const campo of Object.keys(datos)) {
    if (!permitidos.includes(campo)) {
      return res.status(400).json({ error: "El campo " + campo + " no se puede modificar." });
    }
   }
   
   if (datos.estado !== "pendiente" && datos.estado !== "confirmada") {
    return res.status(400).json({ error: "Estado debe ser 'pendiente' o 'confirmada'." });
}

  req.cambiosValidos = req.reservaValidada;
  req.cambiosValidos.estado= datos.estado;
  next();
} // fin validarReemplazoReserva


function validarCambioParcial(req, res, next) {

  const datos = req.body;
  
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res.status(400).json({ error: "Enviá un objeto JSON." });
  }

  for (const campo of Object.keys(datos)) {
    if (campo !== "personas" && campo !== "estado") {
      return res.status(400).json({ error: "Solo se puede cambiar cantidad de personas y el estado." });
    }
  }

  if (datos.personas === undefined && datos.estado === undefined) {
    return res.status(400).json({ error: "Enviá cantidad de personas (1 a 6) o estado (pendiente o confirmada)." });
  }

  const cambios = {};
  if (datos.personas !== undefined) {
    if (typeof datos.personas !== "number") {
      return res.status(400).json({ error: "Cantidad de personas debe ser un número JSON, sin comillas." });
    }
    if (!Number.isFinite(datos.personas) || datos.personas < 1 || datos.personas > 6) {
      return res.status(400).json({ error: "Cantidad de personas debe ser un número entre 1 y 6." });
    }
    cambios.personas = datos.personas;
  }

  if (datos.estado !== undefined) {
    if (typeof datos.estado !== "string") {
        return res.status(400).json({ error: "estado debe ser un texto" });
    }
    if (datos.estado !== "pendiente" && datos.estado !== "confirmada") {
        return res.status(400).json({ error: "estado debe ser 'pendiente' o 'confirmada'" });
    }
    cambios.estado = datos.estado;
}
  req.cambiosValidos = cambios;
  next();
}


module.exports = { validarReemplazoReserva, validarCambioParcial };
    