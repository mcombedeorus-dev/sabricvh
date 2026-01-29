// BASE DE DATOS DE PRODUCTOS
// NOTA: Asegúrate de que las imágenes con estos nombres exactos
// estén en la misma carpeta que este archivo.
const productos = [
    // Fila 1 de la imagen
    { id: 1, nombre: "Chetos Flaming Hot", precio: 30, img: "chetos flaming hot.jpg" },
    { id: 2, nombre: "Chetos Naranjas", precio: 25, img: "chetos naranjas.jpg" },
    { id: 3, nombre: "Ruffles Queso", precio: 30, img: "ruffles queso.jpg" },
    // Fila 2 de la imagen
    { id: 4, nombre: "Sabritas Fuego", precio: 30, img: "sabritas fuego.jpg" },
    // Usé el nombre que aparece en la imagen para los fritos
    { id: 5, nombre: "Fritos", precio: 25, img: "fritos.jpg" }, 
    { id: 6, nombre: "Sabritas Blancas", precio: 25, img: "sabritas blancas.jpg" }
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

// 1. INICIALIZAR LA TIENDA (Mostrar productos)
function cargarProductos() {
    productos.forEach(p => {
        // Creamos la tarjeta del producto
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

// 2. FUNCIÓN PARA AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarInterfaz();
    
    // Feedback visual
    const button = event.target.closest('button');
    if (button) {
        button.classList.add('btn-added');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ¡Agregado!
        `;
        
        setTimeout(() => {
            button.classList.remove('btn-added');
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Agregar al carrito
            `;
        }, 1000);
    }
}

// 3. ACTUALIZAR EL CARRITO Y TOTALES
function actualizarInterfaz() {
    // Actualizar el contador del header
    cartCountLabel.innerText = carrito.length;

    // Limpiar la lista actual
    cartList.innerHTML = '';

    if (carrito.length === 0) {
        // Volver a poner los placeholders si está vacío
        cartList.innerHTML = `
            <div class="cart-placeholder-item">Tu carrito está vacío</div>
            <div class="cart-placeholder-item">Agrega productos para comenzar</div>
        `;
        totalDisplay.innerText = "0";
        totalPriceSmall.innerText = "0.0";
    } else {
        // Generar los items con el estilo gris
        carrito.forEach(p => {
            const item = document.createElement('div');
            item.className = 'cart-item'; // Usa la clase para fondo gris
            item.innerHTML = `
                <span>${p.nombre}</span>
                <span>$${p.precio}</span>
            `;
            cartList.appendChild(item);
        });

        // Calcular totales
        const total = carrito.reduce((sum, p) => sum + p.precio, 0);
        totalDisplay.innerText = total;
        totalPriceSmall.innerText = total.toFixed(1); // Formato con decimal
    }
}

// 4. FINALIZAR COMPRA
function checkout() {
    if (carrito.length > 0) {
        const total = carrito.reduce((sum, p) => sum + p.precio, 0);
        alert(`¡Gracias por tu compra!\n\nTotal: $${total}\nProductos: ${carrito.length}`);
        carrito = [];
        actualizarInterfaz();
    } else {
        alert("Tu carrito está vacío. Agrega productos primero.");
    }
}

// Arrancar la tienda
cargarProductos();