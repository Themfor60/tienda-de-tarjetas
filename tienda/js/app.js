const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const comprarCarritoBtn = document.querySelector("#comprar-carrito");
const listaCurso = document.querySelector("#lista-cursos");
const paypalContainer = document.querySelector("#paypal-button-container");
let articuloCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
  // Cuando agregas un elemento presiona agregar al carrito
  listaCurso.addEventListener("click", agregarCurso);

  // Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articuloCarrito = []; // Reseteamos el arreglo
    limpiarHTML(); // Eliminamos todo el HTML
  });

  // Mostrar el botón de PayPal para comprar
  comprarCarritoBtn.addEventListener("click", () => {
    if (articuloCarrito.length > 0) {
      // Renderizar el botón de PayPal
      paypal.Buttons({
        style: {
          color: "blue",
          shape: "pill",
          label: "pay",
          

        },
        createOrder: function(data, actions) {
          // Calcular el total
          const total = articuloCarrito.reduce((sum, curso) => sum + parseFloat(curso.precio.replace(/[^0-9.-]+/g, "")) * curso.cantidad, 0);
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2) // Cantidad total a pagar
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert("Compra realizada con éxito, gracias " + details.payer.name.given_name + "!");
            articuloCarrito = []; // Reseteamos el arreglo
            limpiarHTML(); // Eliminamos todo el HTML
          });
        },
        onError: function(err) {
          console.error("Error en la compra con PayPal: ", err);
        }
      }).render(paypalContainer);
    } else {
      alert("El carrito está vacío, no se puede realizar la compra.");
    }
  });
}

// Funciones
function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const tarjetaSeleccionado = e.target.parentElement.parentElement;
    leerDatostarjeta(tarjetaSeleccionado);
  }
}

// Leer el contenido del HTML al que le dimos click y extraer la información
function leerDatostarjeta(curso) {
  // Crear un objeto del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1
  }

  // Revisar si un elemento ya existe en el carrito
  const existe = articuloCarrito.some(curso => curso.id === infoCurso.id);
  if (existe) {
    // Actualizamos la cantidad
    const cursos = articuloCarrito.map(curso => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // Retorna el objeto actualizado
      } else {
        return curso; // Retorna los objetos que no son duplicados
      }
    });
    articuloCarrito = [...cursos];
  } else {
    // Agregamos el curso al carrito
    articuloCarrito = [...articuloCarrito, infoCurso];
  }

  carritoHTML();
}

// Muestra el carrito de compra en el HTML
function carritoHTML() {
  // Limpiar el HTML
  limpiarHTML();

  // Recorrer el carrito y generar el HTML
  articuloCarrito.forEach(curso => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${imagen}" width="80">
      </td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}"> X </a>
      </td>
    `;

    // Agregar el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });
}

// Eliminar los cursos del tbody
function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
