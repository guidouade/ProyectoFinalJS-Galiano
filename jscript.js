// Función para crear una persona
function crearPersona(nombre, edad) {
  return {
    nombre: nombre,
    edad: edad,
  };
}

// Array para almacenar las personas
let personas = [];

// Botón para agregar una persona
const agregarPersonaBtn = document.getElementById('agregar-persona');
agregarPersonaBtn.addEventListener('click', agregarPersona);

// Botón para calcular el promedio
const calcularPromedioBtn = document.getElementById('calcular-promedio');
calcularPromedioBtn.addEventListener('click', calcularEdadPromedio);

// Función para agregar una persona al array y al DOM (usando Promises)
function agregarPersona() {
  return new Promise((resolve, reject) => {
    const nombreInput = document.getElementById('nombreInput').value;
    const edadInput = document.getElementById('edadInput').value;
    let nombre = nombreInput;
    let edad = edadInput;
    edad = parseInt(edad);

    if (!isNaN(edad) && edad >= 0) {
      const persona = crearPersona(nombre, edad);
      personas.push(persona);
      renderizarPersonas();
      guardarPersonasEnLocalStorage();

      // Simulamos una operación asincrónica con setTimeout
      setTimeout(() => {
        resolve(persona);
      }, 1000);
    } else {
      reject('Introduce una edad válida');
    }
  })
  .then((persona) => {
    Swal.fire({
      icon: 'success',
      title: 'Persona agregada',
      showConfirmButton: false,
      timer: 1000,
    });
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Algo salió mal',
      text: error,
    });
  });
}

// Función para eliminar una persona
const eliminarPersona = (nombre) => {
  const persona = personas.find((persona) => persona.nombre === nombre);
  personas.splice(personas.indexOf(persona), 1);
  guardarPersonasEnLocalStorage();
  renderizarPersonas();
};

// Función para renderizar personas en el DOM
function renderizarPersonas() {
  const personasLista = document.getElementById('personas-lista').querySelector('ul');
  personasLista.innerHTML = ''; // Limpiar la lista

  personas.forEach((persona) => {
    const li = document.createElement('li');
    li.textContent = `${persona.nombre} - ${persona.edad} años`;

    // Crear un botón para eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => eliminarPersona(persona.nombre));

    li.appendChild(btnEliminar);
    personasLista.appendChild(li);
  });
}

// Función para guardar la lista de personas en el Local Storage
function guardarPersonasEnLocalStorage() {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem('personas', JSON.stringify(personas));
      resolve('Datos guardados en el almacenamiento local');
    } catch (error) {
      reject('Error al guardar los datos en el almacenamiento local');
    }
  })
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.error(error);
  });
}

// Función para cargar la lista de personas desde el Local Storage
function cargarPersonasDesdeLocalStorage() {
  const personasJSON = localStorage.getItem('personas');
  if (personasJSON) {
    personas = JSON.parse(personasJSON);
    renderizarPersonas();
  }
}

// Función para calcular el promedio de edades de las personas
function calcularEdadPromedio() {
  if (personas.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'No se han agregado personas',
      text: 'Inténtalo nuevamente'
    });
  } else {
    let sumaEdades = 0;
    for (const persona of personas) {
      sumaEdades += persona.edad;
    }
    const promedio = sumaEdades / personas.length;
    const resultadoPromedio = document.getElementById('resultado-promedio');
    resultadoPromedio.textContent = `El promedio de edad de la/s ${personas.length} persona/s registrada/s es de: ${promedio.toFixed(2)}`;
  }
}

// Llamamos a la función para cargar la lista de personas al inicio
cargarPersonasDesdeLocalStorage();

// Nueva función para cargar datos desde una API o archivo JSON
function cargarPersonasDesdeAPI() {
  fetch("personas.json")
    .then((response) => response.json())
    .then((data) => {
      const personas = data.personas;
      renderizarPersonas();
      guardarPersonasEnLocalStorage();
    })
    .catch((error) => {
      console.error('Error al cargar datos el JSON:', error);
    });
}

// Llamar a la función para cargar datos al inicio
cargarPersonasDesdeAPI();