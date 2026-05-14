# CLAUDE.md — Guía de contexto para Tinta & Letras

## Identidad del proyecto

| Campo | Valor |
|---|---|
| Proyecto | Tinta & Letras — Librería Digital |
| Asignatura | Programación con Tecnologías Web |
| Universidad | Universidad Alexander Von Humboldt |
| Programa | Ingeniería de Software — V Semestre |
| Estudiante | Carlos Augusto Aranzazu |
| Docente | Santiago Jaramillo López |
| Repositorio | https://github.com/carlosaugustocue/tinta-y-letras |

---

## Stack tecnológico

- **HTML5 semántico** — sin divs donde corresponda etiqueta semántica
- **CSS vanilla** + variables CSS en `:root` + Tailwind CDN (solo utilidades)
- **JavaScript ES Modules** — `import`/`export` nativos, sin bundler
- **Google Fonts** — Playfair Display (títulos) + Lato (UI)
- **Sin frameworks** — sin React, Vue, Angular, jQuery ni similares

---

## Estructura de archivos

```
pagina-uno/
├── index.html        # Única página — 3 secciones navegables
├── css/
│   └── styles.css    # Estilos custom: hero, cards, carrito, skeletons
├── js/
│   ├── mockApi.js    # API simulada: getBooks() y createOrder()
│   ├── app.js        # Lógica de UI completa
│   └── utils.js      # Funciones puras reutilizables
├── README.md
└── CLAUDE.md         # Este archivo
```

---

## Restricciones del parcial — NO romper nunca

Estas reglas vienen del enunciado del profesor y son criterio de calificación:

### HTML
- **Un solo `<h1>`** en toda la página (el nombre de la librería en el hero).
- Jerarquía estricta: `<h1>` → `<h2>` por sección → `<h3>` por libro. Sin saltos.
- Etiquetas semánticas obligatorias: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Cada `<input>` debe tener su `<label for="...">` visible. Ningún `placeholder` reemplaza al label.
- Tipos de input correctos: `text`, `email`, `tel`, `date`, `number`, `select`.

### Botones
- **Nunca** usar: "OK", "Enviar", "Aceptar", "Submit", "Click aquí".
- Textos actuales: "Agregar al carrito", "Ver detalle", "Buscar libros", "Aplicar filtro", "Finalizar compra", "Vaciar carrito", "Confirmar pedido", "Eliminar libro", "Reintentar".

### mockApi.js
- Delay mínimo de 500 ms — actualmente 800 ms. No bajar de 500 ms.
- `Math.random() < 0.2` — 20 % de error. No eliminar.
- `console.log("500 Internal Server Error", ...)` en cada error. No eliminar.
- Solo exporta dos funciones: `getBooks(filters)` y `createOrder(orderData)`.

### CSS
- Variables en `:root`: `--color-primary`, `--color-accent`, `--color-bg`, `--spacing-sm/md/lg`, `--radius`.
- Grid del catálogo: `repeat(auto-fill, minmax(260px, 1fr))` — no cambiar.
- Media queries en 480 px, 768 px y 1024 px.
- Sin desbordamientos horizontales en ningún breakpoint.

### Usabilidad
- Estados de carga: botón se deshabilita + cambia texto durante llamada a la API.
- Mensajes de error: deben decir QUÉ falló y CÓMO corregirlo.
- Confirmaciones irreversibles: modal custom, nunca `window.confirm()`.
- Estados vacíos: siempre con mensaje descriptivo, nunca espacio en blanco.

---

## Arquitectura JS — separación de responsabilidades

| Archivo | Responsabilidad | Lo que NO debe hacer |
|---|---|---|
| `mockApi.js` | Solo datos y simulación de red | No tocar el DOM |
| `app.js` | Toda la lógica de UI | No hardcodear datos de libros |
| `utils.js` | Funciones puras reutilizables | No efectos secundarios |

---

## Problema conocido: Tailwind CDN vs CSS custom

Tailwind CDN inyecta su CSS dinámicamente vía JS, lo que puede pisar estilos de `styles.css`.

**Solución aplicada:** Los estilos del hero viven en un bloque `<style>` dentro del `<head>` con selectores `#hero .hero-*` para ganar especificidad.

**Regla:** Si agregas estilos para elementos dentro del hero, ponlos en ese bloque `<style>`, no en `styles.css`. Para el resto del sitio, `styles.css` funciona bien.

**No usar** `important: '#main-content'` en `tailwind.config` — rompe los estilos del `<header>` y el `<nav>` que están fuera de `<main>`.

---

## Cómo correr el proyecto

El proyecto usa ES Modules y **no funciona con `file://`**. Usar siempre un servidor HTTP:

```bash
# Desde la carpeta pagina-uno/
python3 -m http.server 8080
# → http://localhost:8080
```

O con Live Server en VS Code.

---

## Datos de los libros

Los 10 libros están hardcodeados en `mockApi.js` (array `BOOKS`). Las portadas e información provienen de **librerianacional.com** (solo con fines educativos — ejercicio académico).

Si se agregan libros nuevos, deben seguir la forma:
```js
{
  id: number,
  title: string,
  author: string,
  genre: string,        // debe coincidir con las opciones del <select> en HTML
  price: number,        // en pesos colombianos (COP)
  coverUrl: string,     // URL directa a imagen
  description: string,
  stock: number,
}
```

Los géneros disponibles en el filtro del HTML son: `Ficción`, `Romance`, `Ciencia Ficción`, `Clásico`, `Misterio`, `Fábula`. Si se agrega un género nuevo, actualizar también el `<select id="genre-filter">` en `index.html`.
