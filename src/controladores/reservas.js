function crearControladorReservas(servicioReservas) {
 
async function listar(req, res) {
    const reservas = await servicioReservas.listar();
    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas,
    });
  } // final de listar

async function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: null,
      valores: {},
    });
  } // final de mostrarFormulario

async function mostrarDetalle(req, res) {
    // const id = Number(req.params.id);
    const reserva = await servicioReservas.obtenerReservaPorId(req.params.id);
    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }
    res.render("reservas/detalle", { titulo: reserva.estudiante, reserva });
  } // final de mostrarDetalle

async function crear(req, res) {
    await servicioReservas.crear(req.reservaValidada);
    res.redirect("/reservas");
  } // fin crear

async function eliminar(req, res) { // nuevo TP9 - elimina desde la pagina html
    const eliminado = await servicioReservas.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }
    res.redirect("/reservas");
  } // Fin Metodo eliminar


  async function listarReservaApi(req, res) { // Modificacion TP10

    const filtrosPermitidos = ["estudiante","sala","orden","pagina","limite"];

    for(const campo of Object.keys(req.query)){
      if(!filtrosPermitidos.includes(campo)){
        return res.status(400).json({ error:"Párametro no permitido"});
      }
    }   
    
    
    const sala = req.query.sala;
    if(sala !== undefined){
      if(typeof sala !== "string" || sala.trim() ===""){
        return res.status(400).json( {error: "El parámetro de sala debe tener contenido"} );
      }
    }   


    let ordenar = "estudiante";
    if(req.query.orden !== undefined){
      ordenar = req.query.orden;
      if(ordenar !== "estudiante" && ordenar !== "personas-asc" && ordenar !== "personas-desc"){
        return res.status(400).json( {error: "Orden no permitido"} );        
      }
    }

    let pagina = 1;
    if(req.query.pagina !== undefined){
      if(typeof req.query.pagina !== "string"){
        return res.status(400).json( {error: "Envia un solo valor de pagina."} );
      }
    

    pagina = Number(req.query.pagina);
    if(!Number.isInteger(pagina) || pagina < 1 || pagina > 1000){
      res.status(400).json( {error: "Página fuera del rango permitido"} );
    }
}
    let limite = 2;
    if(req.query.limite !== undefined){
      if(typeof req.query.limite !== "string"){
        return res.status(400).json( {error: "Envia un solo valor de Limite."} );
      }
    

    limite = Number(req.query.limite);
    if(!Number.isInteger(limite) || limite < 1 || limite > 20){
      res.status(400).json( {error: "Limite fuera del rengo permitido"} );
    }
}
    const reserva = await servicioReservas.consultar(sala,ordenar,pagina,limite);
    res.json(reserva);
  } // Fin Metodo listarReservaApi

  async function obtenerReservaApi(req, res) {
    const reserva = await servicioReservas.obtenerReservaPorId(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrado." });
    }
    res.json(reserva);
  } // Fin Metodo obtenerReservaApi


  async function crearReservaApi(req, res) {
    const reserva = await servicioReservas.crear(req.reservaValidada);
    res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
  } // Fin Metodo crearReservaApi


async function eliminarApi(req, res) { // nuevo TP9
  
  const eliminado = await servicioReservas.eliminar(req.params.id);
  if (!eliminado) {
    return res.status(404).json({ error: "Recurso no encontrado." });
  }
  res.status(204).end();
}

async function reemplazarApi(req, res) { // nuevo TP9
  const reserva = await servicioReservas.reemplazar(req.params.id, req.cambiosValidos);
  if (!reserva) {
    return res.status(404).json({ error: "Recurso no encontrado." });
  }
  res.json(reserva);
}

async function actualizarApi(req, res) {
  const reserva = await servicioReservas.actualizar(req.params.id,req.cambiosValidos);
  if (!reserva) {
    return res.status(404).json({ error: "Recurso no encontrado." });
  }
  res.json(reserva);
}





  return {
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    eliminar, // nuevo TP9 html
    crearReservaApi,
    listarReservaApi,
    obtenerReservaApi,
    eliminarApi, // nuevo TP9
    reemplazarApi, // nuevo TP9
    actualizarApi, // nuevo TP9
  };
}

module.exports = { crearControladorReservas };
