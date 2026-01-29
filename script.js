// BASE DE DATOS DE PRODUCTOS
const productos = [
    // BASE DE DATOS DE PRODUCTOS CORREGIDA
    { id: 1, nombre: "Chetos Flaming Hot", precio: 30, img: "chetos flaming hot.jpg" },
    { id: 2, nombre: "Chetos Naranjas", precio: 25, img: "chetos naranjas.jpg" },
    { id: 3, nombre: "Ruffles Queso", precio: 30, img: "ruffles queso.jpg" },
    { id: 4, nombre: "Sabritas Fuego", precio: 30, img: "sabritas fuego.jpg" },
    { id: 5, nombre: "Fritos", precio: 25, img: "fritos.jpg" }, 
    { id: 6, nombre: "Sabritas Blancas", precio: 25, img: "sabritas blancas.jpg" }, // <-- Revisa que esta coma esté ahí
    { id: 7, nombre: "Churrumais", precio: 25, img: "churrumais.jpg" },
    { id: 8, nombre: "Doritos Flamin Hot", precio: 30, img: "doritos flaming hot.jpg" },
    { id: 9, nombre: "Doritos Nacho", precio: 25, img: "doritos.jpg" },
    { id: 10, nombre: "Pake Taxo Fuego", precio: 30, img: "pake taxo fuego.jpg" },
    { id: 11, nombre: "Rancheritos", precio: 25, img: "rancheritos.jpg" },
    { id: 12, nombre: "Tostitos", precio: 25, img: "tostitos.jpg" }
];

let carrito = [];

// Elementos del DOM
const grid = document.getElementById('product-grid');
const cartList = document.getElementById('cart-items-list');
const totalDisplay = document.getElementById('total-display');
const totalPriceSmall = document.getElementById('total-price-small');
const cartCountLabel = document.getElementById('cart-count');

// Icono de checkmark (SVG)
const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`;

// 1. INICIALIZAR LA TIENDA
function cargarProductos() {
    if(!grid) return;
    grid.innerHTML = '';
    productos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.nombre}">
            <div class="product-name">
                ${checkIconSVG}
                <span>${p.nombre}</span>
            </div>
            <div class="product-price">$${p.precio}</div>
            <button class="btn-add-to-cart" onclick="agregarAlCarrito(${p.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Agregar al carrito
            </button>
        `;
        grid.appendChild(card);
    });
}

// 2. AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        actualizarInterfaz();
        
        // Feedback visual en el botón
        const button = event.currentTarget;
        if (button) {
            const originalHTML = button.innerHTML;
            button.classList.add('btn-added');
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ¡Agregado!
            `;
            
            setTimeout(() => {
                button.classList.remove('btn-added');
                button.innerHTML = originalHTML;
            }, 1000);
        }
    }
}

// 3. ACTUALIZAR INTERFAZ
function actualizarInterfaz() {
    if(cartCountLabel) cartCountLabel.innerText = carrito.length;
    if(!cartList) return;

    cartList.innerHTML = '';

    if (carrito.length === 0) {
        cartList.innerHTML = `
            <div class="cart-placeholder-item">Tu carrito está vacío</div>
            <div class="cart-placeholder-item">Agrega productos para comenzar</div>
        `;
        totalDisplay.innerText = "0";
        totalPriceSmall.innerText = "0.0";
    } else {
        carrito.forEach(p => {
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `<span>${p.nombre}</span><span>$${p.precio}</span>`;
            cartList.appendChild(item);
        });

        const total = carrito.reduce((sum, p) => sum + p.precio, 0);
        totalDisplay.innerText = total;
        totalPriceSmall.innerText = total.toFixed(1);
    }
}

// 4. FINALIZAR COMPRA (CON FORMULARIO PARA TU ESCUELA)
function checkout() {
    if (carrito.length > 0) {
        // Pedimos los datos del alumno
        const nombre = prompt("Ingresa tu Nombre y Apellido:");
        const datosEscuela = prompt("Ingresa tu Grado y Grupo (Ejemplo: 3°B):");

        if (nombre && datosEscuela) {
            const total = carrito.reduce((sum, p) => sum + p.precio, 0);
            const listaNombres = carrito.map(p => p.nombre).join(", ");

            // Enviamos la información al chat de Crisp
            if (typeof $crisp !== 'undefined') {
                // 1. Cambia el nombre del usuario en el chat para que sepas quién es
                $crisp.push(["set", "user:nickname", [nombre]]);
                
                // 2. Envía el mensaje con el pedido
                $crisp.push(["do", "message:send", ["text", `¡Nuevo pedido escolar!
👤 Alumno: ${nombre}
🏫 Grado/Grupo: ${datosEscuela}
🛒 Productos: ${listaNombres}
💰 Total a pagar: $${total}`]]);
                
                // 3. Abre el chat para que el alumno vea la confirmación
                $crisp.push(["do", "chat:open"]);
                
                alert(`¡Gracias ${nombre}! Tu pedido se envió al chat.`);
            } else {
                alert("Error: El chat de Crisp no ha cargado. Intenta de nuevo.");
            }

            // Limpiamos todo
            carrito = [];
            actualizarInterfaz();
        } else {
            alert("Es necesario que pongas tu nombre y grupo para el pedido.");
        }
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Arrancar la tienda
cargarProductos();
