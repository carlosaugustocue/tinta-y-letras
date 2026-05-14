# Tinta & Letras — Librería Digital

**Universidad Alexander Von Humboldt**  
Programa de Ingeniería de Software  
Programación con Tecnologías Web — V Semestre  
Parcial 1

**Estudiante:** Carlos Augusto Aranzazu  
**Docente:** Santiago Jaramillo López

---

## Descripción

**Tinta & Letras** es una Single Page Application (SPA) de e-commerce para la venta de libros, construida íntegramente con **HTML5 semántico**, **CSS vanilla** y **JavaScript puro con ES Modules**, sin frameworks ni librerías de UI externas.

La aplicación permite explorar un catálogo de 10 libros clásicos de la literatura latinoamericana y universal, ver el detalle de cada título, agregarlos a un carrito de compras y completar un formulario de checkout con validación en tiempo real.

El proyecto incluye una API simulada (`mockApi.js`) que replica el comportamiento de un servidor REST real: latencia de red de 800 ms, simulación de errores con un 20 % de probabilidad, y logging de errores `500 Internal Server Error` en consola.

---

## Estructura del proyecto

```
pagina-uno/
├── index.html          # Estructura semántica HTML5 — una sola página con 3 secciones
├── css/
│   └── styles.css      # Estilos: hero premium, grid responsivo, componentes
├── js/
│   ├── mockApi.js      # API simulada: getBooks() y createOrder()
│   ├── app.js          # Lógica de UI: catálogo, carrito, modales, formulario
│   └── utils.js        # Funciones puras: formatCurrency, validateEmail, etc.
└── README.md
```

---

## Cómo correr el proyecto localmente

> ⚠️ El proyecto usa **ES Modules** (`import`/`export`). **No puede abrirse directamente** con `file://` — debe servirse desde un servidor HTTP local.

### Opción 1 — VS Code + Live Server (recomendado)

1. Instala la extensión **Live Server** en VS Code.
2. Abre la carpeta `pagina-uno/` en VS Code.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. El navegador abrirá `http://127.0.0.1:5500` automáticamente.

### Opción 2 — Python (sin instalación adicional)

```bash
# Desde la carpeta pagina-uno/
python3 -m http.server 8080
# Abre http://localhost:8080 en el navegador
```

### Opción 3 — Node.js

```bash
npx serve pagina-uno
```

---

## Funcionalidades implementadas

### Sección 1 — Hero / Landing
- Presentación de la librería con nombre, tagline y 3 portadas destacadas.
- Diseño editorial con grid 55/45, textura de fondo, gradiente radial y libros con rotación y sombras volumétricas.
- Dos CTAs principales: **Explorar catálogo** y **Comprar ahora**.

### Sección 2 — Catálogo de libros
- Grid responsivo con `repeat(auto-fill, minmax(260px, 1fr))`.
- Búsqueda por título o autor y filtro por género con llamada a `mockApi.getBooks()`.
- **Estado de carga**: skeletons animados mientras se espera la respuesta de la API.
- **Estado vacío**: mensaje descriptivo si no hay resultados de búsqueda.
- **Modal de detalle**: portada ampliada, descripción completa, stock disponible y precio. Permite agregar al carrito desde el detalle.
- Carrito lateral (sidebar) con subtotales por ítem, total acumulado y badge de cantidad.
- **Modal de confirmación custom** (sin `window.confirm`) para vaciar el carrito y eliminar ítems individuales.
- Estado vacío del carrito con mensaje explicativo.

### Sección 3 — Formulario de checkout
- 7 campos con tipos HTML correctos: `text`, `email`, `tel`, `date`, `number`, `text`, `select`.
- Cada campo tiene `<label>` visible asociado con `for`/`id`. Ningún placeholder reemplaza al label.
- Validación en el cliente con mensajes descriptivos que indican qué falló y cómo corregirlo.
- El botón "Confirmar pedido" se deshabilita y cambia su texto a "Procesando pedido…" durante la llamada a la API.
- Banners de éxito (número de orden y fecha estimada de entrega) y de error.

### Usabilidad
- Ningún botón usa texto genérico ("OK", "Enviar", "Aceptar"). Textos utilizados: "Agregar al carrito", "Ver detalle", "Buscar libros", "Aplicar filtro", "Finalizar compra", "Vaciar carrito", "Confirmar pedido", "Eliminar libro", "Reintentar".
- Mensajes de error específicos. Ejemplo: *"El correo ingresado no tiene un formato válido. Ejemplo: nombre@dominio.com."*
- Tecla `Escape` cierra los modales abiertos.
- Diseño 100 % responsivo: mobile (1 columna), tablet (2 columnas), desktop (3+ columnas).

---

## Endpoints simulados — mockApi.js

Ambas funciones simulan latencia de red y fallos aleatorios de servidor:

- **Latencia**: `await new Promise(resolve => setTimeout(resolve, 800))` — 800 ms mínimo.
- **Tasa de error**: `Math.random() < 0.2` — 20 % de probabilidad de fallo.
- **Log de errores**: `console.log("500 Internal Server Error", ...)` en cada fallo.

---

### `getBooks(filters)` — GET /api/books

Retorna el catálogo de libros con filtrado opcional por género y búsqueda de texto.

| Campo | Detalle |
|---|---|
| Método HTTP equivalente | `GET` |
| URL equivalente | `/api/books?genre=Ficción&search=borges` |
| Parámetros | `{ genre?: string, search?: string }` |
| Latencia simulada | 800 ms |
| Probabilidad de error | 20 % |

**Respuesta exitosa:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Cien años de soledad",
      "author": "Gabriel García Márquez",
      "genre": "Ficción",
      "price": 79000,
      "coverUrl": "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/244798/Portada.jpg",
      "description": "«Muchos años después, frente al pelotón de fusilamiento...»",
      "stock": 12
    }
  ]
}
```

**Respuesta de error:**
```json
{
  "ok": false,
  "message": "Error al cargar el catálogo. Intenta nuevamente."
}
```

---

### `createOrder(orderData)` — POST /api/orders

Registra una nueva orden de compra y retorna el ID de orden y fecha estimada de entrega.

| Campo | Detalle |
|---|---|
| Método HTTP equivalente | `POST` |
| URL equivalente | `/api/orders` |
| Latencia simulada | 800 ms |
| Probabilidad de error | 20 % |

**Body de la petición:**
```json
{
  "customer": {
    "fullName": "Ana García López",
    "email": "ana@ejemplo.com",
    "phone": "3001234567",
    "deliveryDate": "2026-05-20",
    "cardNumber": "4111111111111111",
    "address": "Calle 100 #45-67, Bogotá",
    "paymentMethod": "credit-card"
  },
  "items": [
    {
      "id": 1,
      "title": "Cien años de soledad",
      "price": 79000,
      "quantity": 2
    }
  ],
  "total": 158000
}
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "data": {
    "orderId": "ORD-A1B2C3",
    "estimatedDelivery": "2026-05-21"
  }
}
```

**Respuesta de error:**
```json
{
  "ok": false,
  "message": "No fue posible procesar tu pedido. Verifica tu conexión e intenta de nuevo."
}
```

---

## Checklist de entrega

### HTML
- [x] Un solo `<h1>` en toda la página
- [x] `<h2>` en cada sección principal, `<h3>` en subsecciones
- [x] `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` usados correctamente
- [x] Todos los inputs tienen `<label>` visible con `for`/`id` correctos
- [x] Todos los inputs tienen `type` apropiado (`email`, `tel`, `number`, `date`, `text`)
- [x] Ningún `placeholder` reemplaza un `label`

### CSS
- [x] Variables CSS definidas en `:root`
- [x] Grid responsivo con `auto-fill` en catálogo
- [x] Media queries para 480 px, 768 px y 1024 px
- [x] Sin desbordamientos horizontales en ningún breakpoint
- [x] Espaciado consistente usando variables

### Usabilidad
- [x] Ningún botón dice "OK", "Enviar", "Aceptar" o similares
- [x] Todos los errores dicen qué falló y cómo corregirlo
- [x] Botón de submit se deshabilita y cambia texto durante la carga
- [x] Modal de confirmación custom para vaciar carrito y eliminar ítems
- [x] Estado vacío con mensaje en carrito y en búsqueda sin resultados

### mockApi.js
- [x] `getBooks` con delay ≥ 500 ms (implementado: 800 ms)
- [x] `createOrder` con delay ≥ 500 ms (implementado: 800 ms)
- [x] Ambas simulan éxito y error con `Math.random()`
- [x] Error incluye `console.log("500 Internal Server Error", ...)`
- [x] El frontend maneja éxito y error con UI apropiada en ambos casos
