# tp-10-salas-consultas-mongodb
Este proyecto es una copia el TP9, se realizo una copia de todo las archivos expto de la carpeta node, package-lock.jons y .env
# Preparaicon de altas, entorno y DNS
Para este TP se creo una nueva base de datos llamada reservas_salas_u10 que contiene la colleccion reservas  y completar 
MONGODB_URI localmente.
en le archivo .env se define variables de entono como:
PORT=3500
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<base>?retryWrites=true&w=majority 
# Comandos de inicio y para la instalacion
lugo de la copia se ejecuto los siguientes comandos:
a) npm instalar: para recostruir el proyecto, se instalan todos las dependecias.
b) npm run format :
c) npm check: verificar la sintaxios del index.js
D) npm comprobardb : para comprobar la conexion con la base de datos.

# Datos Gurdados en la base de datos
{                               (_id: 6af231e8794045e167e15f5c )
"estudiante": "Ana Ejemplo",
"email": "ana@example.com",
"sala": "Sala Norte",
"fecha": "2026-10-28",
"turno": "Mañana",
"personas": 2
}
{                               ("_id": "6af232d5794045e167e15f5d")
"estudiante": "Bruno Ejemplo", 
"email": "bruno@example.com",
"sala": "Sala Norte",
"fecha": "2026-10-28",
"turno": "Mañana",
"personas": 1
}
{                               ("_id": "6af2331d794045e167e15f5e")
"estudiante": "Carla Ejemplo",
"email": "carla@example.com",
"sala": "Sala Norte",
"fecha": "2026-10-28",
"turno": "Mañana",
"personas": 2
}
{                               ("_id": "6af2336d794045e167e15f5f")
"estudiante": "Diego Ejemplo",
"email": "diego@example.com",
"sala": "Sala Norte",
"fecha": "2026-10-28",
"turno": "Mañana",
"personas": 3
}
{                               ("_id": "6af233b8794045e167e15f60")
"estudiante": "Elena Ejemplo",
"email": "elena@example.com",
"sala": "Sala Sur",
"fecha": "2026-10-28",
"turno": "Mañana",
"personas": 1
}
{                               ("_id": "6af23404794045e167e15f61")
"estudiante": "Fabian Ejemplo",
"email": "fabian@example.com",
"sala": "Sala Multimedia",
"fecha": "2026-10-28",
"turno": "Mañana",
"personas": 4
}
# Primero Modificacion Agregara Filtro sala.
Se utiliza la funcion find, funcion de mongose para buscar coicidencias.
async function consultar(sala){
  const filtro = {};
  if(sala !== undefined){
    filtro.sala = sala.trim();
  }  
  const documentos = await Reserva.find(filtro).lean();
  return documentos.map(representarReserva);
}

Comprobar:                  Resultado
sin Params:                 codigo: 200 OK, toda las reservas, arreglo de seis.
sala=Sala Norte:            codigo: 200 OK, 4 reservas, arreglo de cuatro. 
sala=Sala inexistente:      sala = Sala Este, codigo 200 OK, ninguna reserva, arreglo vacío.
sala= vacío                 codigo: 400 Bad Request, mensaje de error -> { "error": "El parámetro de sala debe tener contenido" }
salas=Sala Norte:           codigo: 400 Bad Request, mensaje de error -> { "error": "Párametro no permitido" }

# Segundo Agregar el orden
async function consultar(sala, orden = "estudiante"){ 
  const filtro = {};
  if(sala !== undefined){
    filtro.sala = sala.trim();
  }  
  let ordenarFiltrado = { estudiante: 1, _id: 1 };
    if(orden === "personas-asc"){
        ordenarFiltrado = { personas: 1, _id: 1 };
    }
    if(orden === "personas-desc"){
        ordenarFiltrado = { personas: -1, _id: 1 };
    }
  const documentos = await Reserva.find(filtro).sort(ordenarFiltrado).lean();
  return documentos.map(representarReserva);
}
Comprobar:                              Resultado
Sala Norte con personas-asc             codigo: 200 OK  devuelve 1 ,1 ,2 ,2, 3 y 4. 
Personas-desc                           codigo: 200 OK  devuelve 4, 3 , 2, 2 y 1. 
Orden desconocido: 400.                 400 Bad Request mensaje de error -> { "error": "Orden no permitido" }
# Agregar páginas (no esta en la teoria)
async function consultar(sala, orden = "estudiante",pagina = 1, limite = 2){ // nueva funcion TP10
  const filtro = {};
  if(sala !== undefined){
    filtro.sala = sala.trim();
  }
  
  let ordenar = { estudiante: 1, _id: 1 };
    if(orden === "personas-asc"){
        ordenar = { personas: 1, _id: 1 };
    }
    if(orden === "personas-desc"){
        ordenar = { personas: -1, _id: 1 };
    }
  
    const salto = (pagina - 1) * limite;
    const total = await Reserva.countDocuments(filtro);
    const documentos = await Reserva.find(filtro).sort(ordenar).skip(salto).limit(limite).lean();
  return{
    datos: documentos.map(representarReserva),
    pagina,
    limite,
    total,
    paginas: Math.ceil(total / limite)
  }; 
}

# Solicitudes en Postman
Key                 Valores
sala                Sala Norte   
orden               personas-asc
pagina              1
limite              2
Resultado:
200 OK
{
  "datos": [
    {
      "id": "6af232d5794045e167e15f5d",
      "estudiante": "Bruno Ejemplo",
      "email": "bruno@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-10-28",
      "turno": "Mañana",
      "personas": 1,
      "estado": "pendiente"
    },
    {
      "id": "6af231e8794045e167e15f5c",
      "estudiante": "Ana Ejemplo",
      "email": "ana@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-10-28",
      "turno": "Mañana",
      "personas": 2,
      "estado": "pendiente"
    }
  ],
  "pagina": 1,
  "limite": 2,
  "total": 4,
  "paginas": 2
}

# Solicitudes
Caso                                        Resultado esperado
Sin Params activos                          codigo: 200 OK -> 2 reservas, pagina 1, limite 2, total 6, paginas 3
Sala Norte, pagina 3, limite 2              codigo: 200 OK -> datos vacío, total 4, paginas 2, estado 200
Sala inexistente                            codigo: 200 OK -> datos vacío, total 0, paginas 0, estado 200
pagina=0                                    codigo: 400 Bad Request -> mensaje error { "error": "Página fuera del rango permitido" }
pagina=1.5                                  codigo: 400 Bad Request -> mensaje error { "error": "Página fuera del rango permitido" }
limite=21                                   codigo: 400 Bad Request -> mensaje error { "error": "Limite fuera del rengo permitido" }
sala vacía                                  codigo: 400 Bad Request -> mensaje error { "error": "El parámetro de sala debe tener contenido" }
repetida                                    codigo: 200 OK 
orden=otro                                  codigo: 400 Bad Request -> mensaje error { "error": "Orden no permitido" }
select=email                                codigo: 400 Bad Request -> mensaje error { "error": "Párametro no permitido" }

# Continuidad y pequeña decisión de diseño
Una sala: datos propios que se pueden incorporar, como nombre, capacidad, ubicacion y equipamiento.
Una reserva: datos de una solicitud, como estudiante, email, fecha, turno, personas y estado. También debe indicar que sala se reservo.
por ejemplo:
{
  "estudiante": "Ana Pérez",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-12-06",
  "turno": "Mañana",
  "personas": 2,
  "salaId": "id de la dala reservada"
}
Tiene sentido porque una sala puede aparecer en muchas reservas y sus datos se administran en un solo lugar. Asi se evita repetirlos y se pueden consultar o actualizar por separado.