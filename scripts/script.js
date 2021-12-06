let productosJSON = [];
let carrito = [];

// HAGO EL GET DEL ARRAY EN JSON

const obtenerJsonProductos = () => {
    
    const URLJSON = "productos.json";
    $.getJSON(URLJSON, function(respuesta, estado) {

        if (estado == "success") {
            productosJSON = respuesta;
            renderizarCards();
            mostrarDetalles();   
        };
    }); 
};

obtenerJsonProductos();


// CREO LAS CARDS 

function renderizarCards(){
    for (const producto of productosJSON){
        let lista = document.createElement("li");
        lista.setAttribute("class", "card card-body listaProductosLi");
        lista.innerHTML = `<p id="idProducto" hidden>${producto.id}</p>
                            <img id="imgProducto" class="imgProductos" src="${producto.imagen}"></img>
                            <h3 id="nombreProducto" class="fuente">${producto.nombre}</h3>
                            <p class="hidden fuente">Alto: ${producto.alto}</p>
                            <p class="hidden fuente">Ancho: ${producto.ancho}</p>
                            <p id="precioProducto" class="fuente"><b>$ ${producto.precio}</b></p>
                            <p id="precioEfectivo" class="hidden fuente"><b>Precio en efectivo: $ ${(producto.precio) * 0.9}</b></p>
                            <button class="botonDetalles btn btn-link fuente">+ más detalles</button>
                            <button class="botonAgregar btn btn-secondary fuente">Agregar al carrito</button>`;
        document.getElementById("listaProductos").appendChild(lista);
    };

    // CREO EVENTO PARA AGREGAR PRODUCTOS AL CARRITO

    const botones = document.getElementsByClassName("botonAgregar");
    for (const boton of botones){
        boton.addEventListener("click", agregarAlCarritoClick);
    };
};

// CLASE CONSTRUCTORA PARA PRODUCTOS AGREGADOS AL CARRITO 

class productoCarrito {
    constructor(nombre, precio, imagen, id) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.id = id;
    }
}

// FUNCION PARA AGREGAR PRODUCTOS AL CARRITO MEDIANTE EL EVENTO

function agregarAlCarritoClick(event){

    const btn = event.target;
    
    const item = btn.closest('.listaProductosLi');

    const itemNombre = item.querySelector('#nombreProducto').textContent;

    const itemPrecio = item.querySelector('#precioProducto').textContent;

    const itemImagen = item.querySelector('#imgProducto').src;

    const itemId = item.querySelector('#idProducto').textContent;

    agregarAlCarrito(itemNombre, itemPrecio, itemImagen, itemId);

    habilitarBotonPago();
}


//FUNCION QUE BUSCA SI EL PRODUCTO YA ESTÁ EN EL CARRITO, Y ACTUALIZA CANTIDAD


let tablaBody = document.getElementById("tablaBody");

function agregarAlCarrito(itemNombre, itemPrecio, itemImagen, itemId){
    
    let encontrado = carrito.find(prod => prod.id == itemId);

    if (encontrado == undefined) {

        let fila = document.createElement("tr");

        let filaCarrito = `<td><img id="imgCarrito" src="${itemImagen}"></img></td>
        <td class="nombreProducto fuente">${itemNombre}</td>
        <td id="precioProducto" class="fuente"><b>${itemPrecio}</b></td>
        <td id="id" class="hidden"><b>${itemId}</b></td>
        <td><input type="number" value="1" class="cantidadProducto form-control"><td>
        <td><button id="botonBorrar" class="btn-close"></button><td>`;

        fila.innerHTML = filaCarrito;
        fila.setAttribute("class", "filaCarrito");
        tablaBody.appendChild(fila); 

        let productoAAgregar = new productoCarrito(itemNombre, itemPrecio, itemImagen, itemId);
        carrito.push(productoAAgregar);
        Swal.fire(
            'Producto: ' + itemNombre,
            'ha sido agregado al carrito',
            'success'
        );

        fila.querySelector('#botonBorrar').addEventListener("click", borrarItemCarrito); 
        
        mostrarBadge();

    }else{
        let posicion = carrito.findIndex(p => p.id == itemId);
        
        let itemCantidad = document.getElementsByClassName("cantidadProducto");

        itemCantidad[posicion].value++;

        Swal.fire(
            'Producto: ' + itemNombre,
            'ha sido agregado al carrito',
            'success'
        );
}
    
    // EVENTO PARA CAMBIAR LA CANTIDAD EN EL CARRITO

    const cantidades = document.getElementsByClassName("cantidadProducto");
    for (cantidad of cantidades){
        cantidad.addEventListener("change", cambiarCantidad);
    };

    actualizarTotal();

    guardarCarrito(carrito);
};


// FUNCION PARA ACTUALIZAR EL TOTAL

const totalCarrito = document.querySelector('#totalCarrito');
let total

function actualizarTotal(){

    total = 0;

    const itemsCarrito = document.querySelectorAll('.filaCarrito');
    
    itemsCarrito.forEach(itemCarrito => {

        const precioItemCarrito = Number(itemCarrito.querySelector('#precioProducto').textContent.replace('$', ''));

        const cantidadItemCarrito = Number(itemCarrito.querySelector('.cantidadProducto').value);

        total = total + precioItemCarrito * cantidadItemCarrito;
    });

    if (total != 0){
        totalCarrito.innerHTML = `<b>Total: $${total}</b>`;
    }else{
        totalCarrito.innerHTML = ``
        deshabilitarBotonPago();
    }   
    return total;
};


// FUNCION PARA BORRAR LOS ITEMS DEL CARRITO

function borrarItemCarrito(event){

    const botonBorrar = event.target;

    botonBorrar.closest('.filaCarrito').remove();

    actualizarTotal();
};

//FUNCION PARA CAMBIAR LA CANTIDAD MEDIANTE EL INPUT

function cambiarCantidad(event){

    const cantidadNueva = event.target;

    if (cantidadNueva.value <= 0){

        cantidadNueva.value = 1;
    }

    actualizarTotal();   
};


// GUARDAR EN EL STORAGE

function guardarCarrito(carrito){

    const carritoGuardado = localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.getItem(carritoGuardado);
};


// MODAL DE PAGO

let botonDePago = document.getElementById("botonDePago");

botonDePago.addEventListener("click", renderizarModal);

function renderizarModal(event){

    botonDePago = event.target;

    let modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = `<select class="form-select" id="formaDePago" required aria-label="select example">
                            <option selected disabled>Elija la forma de pago</option>
                            <option value="${total * 0.9}">Efectivo (10% de descuento)</option>
                            <option value="${total}">Débito/Crédito</option>
                            </select>
                            <h4 id="totalModal"></h4>`;

    let formaDePago = document.getElementById("formaDePago");

    formaDePago.addEventListener("change", (e) => {
        formaDePago = e.target;
        let totalModal = document.getElementById("totalModal")
        totalModal.innerHTML = `Total: $ ${formaDePago.value}`;
    });
}


