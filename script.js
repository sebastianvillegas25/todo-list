let listaTareas = document.getElementById("listaTareas");
let input = document.getElementById("tareaInput");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function agregarTarea() {
  const texto = input.value.trim();
  if (texto === "") return;

  tareas.push({
    texto,
    completada: false,
    fecha: new Date().toISOString()
  });

  guardarTareas();
  input.value = "";
  renderTareas();
}

function eliminarTarea(index) {
  tareas.splice(index, 1);
  guardarTareas();
  renderTareas();
}

function toggleCompletada(index) {
  tareas[index].completada = !tareas[index].completada;
  guardarTareas();
  renderTareas();
}

function renderTareas() {
  const filtro = document.getElementById("filtro").value;
  const orden = document.getElementById("orden").value;

  let tareasFiltradas = tareas.filter(t => {
    if (filtro === "completadas") return t.completada;
    if (filtro === "pendientes") return !t.completada;
    return true;
  });

  if (orden === "nombre") {
    tareasFiltradas.sort((a, b) => a.texto.localeCompare(b.texto));
  } else if (orden === "fecha") {
    tareasFiltradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  listaTareas.innerHTML = "";

  tareasFiltradas.forEach((tarea, index) => {
    const li = document.createElement("li");
    li.className = tarea.completada ? "completada" : "";
    li.innerHTML = `
      ${tarea.texto}
      <div class="acciones">
        <button onclick="toggleCompletada(${tareas.indexOf(tarea)})">✔️</button>
        <button onclick="eliminarTarea(${tareas.indexOf(tarea)})">🗑️</button>
      </div>
    `;
    listaTareas.appendChild(li);
  });
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function toggleModoOscuro() {
  document.body.classList.toggle("dark");
  localStorage.setItem("modoOscuro", document.body.classList.contains("dark"));
}

function cargarModoOscuro() {
  const activo = localStorage.getItem("modoOscuro") === "true";
  if (activo) document.body.classList.add("dark");
}

// Inicializar
cargarModoOscuro();
renderTareas();
