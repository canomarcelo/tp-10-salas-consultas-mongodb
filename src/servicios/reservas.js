function crearServicioReservas(datosIniciales) {
  const reservas = [...datosIniciales];

  function listar() {
    return [...reservas];
  }

  function obtenerPorId(id) {
    return reservas.find((elemento) => elemento.id === id) ?? null;
  }

  function crear(datosValidados) {
    const ultimoId = reservas.reduce(
      (mayorId, reserva) => Math.max(mayorId, reserva.id),
      0,
    );
    const nuevo = { id: ultimoId + 1, ...datosValidados };
    reservas.push(nuevo);
    return nuevo;
  }

  return { listar, obtenerPorId, crear };
}

module.exports = { crearServicioReservas };
