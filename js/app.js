// js/app.js
import { getBooks, createOrder } from "./mockApi.js";
import {
  formatCurrency,
  validateEmail,
  validatePhone,
  validateCardNumber,
  sanitizeText,
  getMinDeliveryDate,
} from "./utils.js";

// ── State ──────────────────────────────────────────────────────────────────

let cart = [];
let pendingClearAll = false;
let pendingRemoveId = null;

// ── DOM references ─────────────────────────────────────────────────────────

const catalogGrid       = document.getElementById("catalog-grid");
const cartItemsList     = document.getElementById("cart-items-list");
const cartTotal         = document.getElementById("cart-total");
const cartCount         = document.getElementById("cart-count");
const cartEmpty         = document.getElementById("cart-empty");
const cartContent       = document.getElementById("cart-content");
const cartSidebar       = document.getElementById("cart-sidebar");
const cartOverlay       = document.getElementById("cart-overlay");
const searchInput       = document.getElementById("search-input");
const genreSelect       = document.getElementById("genre-filter");
const searchBtn         = document.getElementById("search-btn");
const clearCartBtn      = document.getElementById("clear-cart-btn");
const checkoutForm      = document.getElementById("checkout-form");
const confirmModal      = document.getElementById("confirm-modal");
const modalMessage      = document.getElementById("modal-message");
const modalConfirmBtn   = document.getElementById("modal-confirm-btn");
const modalCancelBtn    = document.getElementById("modal-cancel-btn");
const bookDetailModal   = document.getElementById("book-detail-modal");
const detailCover       = document.getElementById("detail-cover");
const detailGenre       = document.getElementById("detail-genre");
const detailTitle       = document.getElementById("detail-title");
const detailAuthor      = document.getElementById("detail-author");
const detailDescription = document.getElementById("detail-description");
const detailPrice       = document.getElementById("detail-price");
const detailStock       = document.getElementById("detail-stock");
const detailAddBtn      = document.getElementById("detail-add-btn");
const orderSuccessBanner = document.getElementById("order-success-banner");
const orderErrorBanner  = document.getElementById("order-error-banner");
const catalogErrorBanner = document.getElementById("catalog-error-banner");
const deliveryDateInput = document.getElementById("delivery-date");
const submitBtn         = document.getElementById("submit-order-btn");

// ── Initialization ─────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  deliveryDateInput.min = getMinDeliveryDate();
  loadBooks();
  renderCart();
  setupNavLinks();
});

// ── Navigation ─────────────────────────────────────────────────────────────

function setupNavLinks() {
  document.querySelectorAll("a[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Mobile nav toggle
const navToggleBtn = document.getElementById("nav-toggle-btn");
const navMobile    = document.getElementById("nav-mobile");

navToggleBtn.addEventListener("click", () => {
  const isOpen = navMobile.classList.toggle("hidden");
  navToggleBtn.setAttribute("aria-expanded", String(!isOpen));
});

navMobile.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    navMobile.classList.add("hidden");
    navToggleBtn.setAttribute("aria-expanded", "false");
  });
});

// ── Cart sidebar open/close ────────────────────────────────────────────────

function openCart() {
  cartSidebar.classList.add("cart-sidebar--open");
  cartOverlay.classList.remove("hidden");
}

function closeCart() {
  cartSidebar.classList.remove("cart-sidebar--open");
  cartOverlay.classList.add("hidden");
}

document.getElementById("cart-toggle-btn").addEventListener("click", () => {
  cartSidebar.classList.contains("cart-sidebar--open") ? closeCart() : openCart();
});
document.getElementById("cart-close-btn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("go-to-checkout-btn").addEventListener("click", closeCart);

// ── Catalog ────────────────────────────────────────────────────────────────

async function loadBooks(filters = {}) {
  setButtonLoading(searchBtn, true, "Buscando libros...");
  hideBanner(catalogErrorBanner);
  catalogGrid.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const s = document.createElement("div");
    s.className = "book-skeleton";
    catalogGrid.appendChild(s);
  }

  const result = await getBooks(filters);

  catalogGrid.innerHTML = "";
  setButtonLoading(searchBtn, false, "Buscar libros");

  if (!result.ok) {
    showBanner(catalogErrorBanner, `No pudimos cargar el catálogo: ${result.message}`);
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Reintentar";
    retryBtn.className = "ml-3 underline font-semibold hover:no-underline";
    retryBtn.addEventListener("click", () => loadBooks(filters));
    catalogErrorBanner.appendChild(retryBtn);
    return;
  }

  renderBooks(result.data);
}

function renderBooks(books) {
  if (books.length === 0) {
    catalogGrid.innerHTML = `
      <div class="empty-state" role="status">
        <span class="empty-icon" aria-hidden="true">🔍</span>
        <p>No encontramos libros con ese criterio. Intenta con otro título o autor.</p>
      </div>`;
    return;
  }

  books.forEach((book) => {
    const article = document.createElement("article");
    article.className = "book-card";
    article.innerHTML = `
      <img src="${book.coverUrl}" alt="Portada del libro ${sanitizeText(book.title)}" loading="lazy" />
      <div class="book-card__body">
        <span class="book-card__genre">${sanitizeText(book.genre)}</span>
        <h3 class="book-card__title">${sanitizeText(book.title)}</h3>
        <p class="book-card__author">${sanitizeText(book.author)}</p>
        <p class="book-card__description">${sanitizeText(book.description)}</p>
        <div class="book-card__footer">
          <strong class="book-card__price">${formatCurrency(book.price)}</strong>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
            <button
              class="book-card__detail-btn"
              aria-label="Ver detalle de ${sanitizeText(book.title)}"
            >Ver detalle</button>
            <button
              class="book-card__add-btn"
              data-book-id="${book.id}"
              aria-label="Agregar ${sanitizeText(book.title)} al carrito"
            >Agregar al carrito</button>
          </div>
        </div>
      </div>`;
    article.querySelector(".book-card__add-btn").addEventListener("click", () => addToCart(book));
    article.querySelector(".book-card__detail-btn").addEventListener("click", () => openBookDetail(book));
    catalogGrid.appendChild(article);
  });
}

// ── Search / filter ────────────────────────────────────────────────────────

searchBtn.addEventListener("click", () =>
  loadBooks({ search: searchInput.value, genre: genreSelect.value })
);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

document.getElementById("apply-filter-btn").addEventListener("click", () =>
  loadBooks({ search: searchInput.value, genre: genreSelect.value })
);

// ── Cart ───────────────────────────────────────────────────────────────────

function addToCart(book) {
  const existing = cart.find((i) => i.id === book.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }
  renderCart();
  openCart();
}

function renderCart() {
  const isEmpty = cart.length === 0;

  cartEmpty.classList.toggle("hidden", !isEmpty);
  cartContent.classList.toggle("hidden", isEmpty);
  cartContent.classList.toggle("flex", !isEmpty);
  clearCartBtn.disabled = isEmpty;

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatCurrency(total);

  cartItemsList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item__info">
        <span class="cart-item__title">${sanitizeText(item.title)}</span>
        <span class="cart-item__qty">× ${item.quantity}</span>
      </div>
      <div class="cart-item__actions">
        <span class="cart-item__subtotal">${formatCurrency(item.price * item.quantity)}</span>
        <button
          class="cart-item__remove-btn"
          aria-label="Eliminar ${sanitizeText(item.title)} del carrito"
          data-remove-id="${item.id}"
        >Eliminar libro</button>
      </div>`;
    li.querySelector("button").addEventListener("click", () =>
      confirmRemoveItem(item.id, item.title)
    );
    cartItemsList.appendChild(li);
  });
}

// ── Book detail modal ──────────────────────────────────────────────────────

function openBookDetail(book) {
  detailCover.src = book.coverUrl;
  detailCover.alt = `Portada de ${book.title}`;
  detailGenre.textContent = book.genre;
  detailTitle.textContent = book.title;
  detailAuthor.textContent = book.author;
  detailDescription.textContent = book.description;
  detailPrice.textContent = formatCurrency(book.price);
  detailStock.textContent = book.stock > 0
    ? `${book.stock} unidades disponibles`
    : "Agotado";

  detailAddBtn.onclick = () => {
    addToCart(book);
    closeBookDetail();
  };
  detailAddBtn.disabled = book.stock === 0;

  bookDetailModal.classList.remove("hidden");
  document.getElementById("detail-close-btn").focus();
}

function closeBookDetail() {
  bookDetailModal.classList.add("hidden");
}

document.getElementById("detail-close-btn").addEventListener("click", closeBookDetail);
bookDetailModal.addEventListener("click", (e) => {
  if (e.target === bookDetailModal) closeBookDetail();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeBookDetail();
    closeModal();
  }
});

// ── Confirmation modal ─────────────────────────────────────────────────────

clearCartBtn.addEventListener("click", () => {
  pendingClearAll = true;
  pendingRemoveId = null;
  modalMessage.textContent =
    "¿Deseas vaciar el carrito? Esta acción eliminará todos los libros seleccionados y no se puede deshacer.";
  modalConfirmBtn.textContent = "Sí, vaciar carrito";
  openModal();
});

function confirmRemoveItem(id, title) {
  pendingRemoveId = id;
  pendingClearAll = false;
  modalMessage.textContent = `¿Deseas eliminar "${sanitizeText(title)}" del carrito?`;
  modalConfirmBtn.textContent = "Sí, eliminar libro";
  openModal();
}

modalConfirmBtn.addEventListener("click", () => {
  if (pendingClearAll) {
    cart = [];
  } else if (pendingRemoveId !== null) {
    cart = cart.filter((i) => i.id !== pendingRemoveId);
  }
  pendingClearAll = false;
  pendingRemoveId = null;
  closeModal();
  renderCart();
});

modalCancelBtn.addEventListener("click", closeModal);

confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) closeModal();
});

function openModal() {
  confirmModal.classList.remove("hidden");
  modalConfirmBtn.focus();
}

function closeModal() {
  confirmModal.classList.add("hidden");
}

// ── Form validation ────────────────────────────────────────────────────────

function clearFieldError(fieldId) {
  const err = document.getElementById(`${fieldId}-error`);
  if (err) err.textContent = "";
  const input = document.getElementById(fieldId);
  if (input) input.removeAttribute("aria-invalid");
}

function setFieldError(fieldId, message) {
  const err = document.getElementById(`${fieldId}-error`);
  if (err) err.textContent = message;
  const input = document.getElementById(fieldId);
  if (input) input.setAttribute("aria-invalid", "true");
}

function validateForm() {
  let valid = true;
  const fields = ["full-name", "email", "phone", "delivery-date", "card-number", "address", "payment-method"];
  fields.forEach((f) => clearFieldError(f));

  if (document.getElementById("full-name").value.trim().length < 3) {
    setFieldError("full-name", "El nombre completo debe tener al menos 3 caracteres. Ejemplo: Ana García López.");
    valid = false;
  }

  if (!validateEmail(document.getElementById("email").value.trim())) {
    setFieldError("email", "El correo ingresado no tiene un formato válido. Ejemplo: nombre@dominio.com.");
    valid = false;
  }

  if (!validatePhone(document.getElementById("phone").value.trim())) {
    setFieldError("phone", "El teléfono debe contener entre 7 y 15 dígitos. Ejemplo: 3001234567.");
    valid = false;
  }

  const deliveryDate = document.getElementById("delivery-date").value;
  if (!deliveryDate || deliveryDate < getMinDeliveryDate()) {
    setFieldError("delivery-date", `La fecha de entrega debe ser al menos 3 días a partir de hoy (${getMinDeliveryDate()}).`);
    valid = false;
  }

  if (!validateCardNumber(document.getElementById("card-number").value)) {
    setFieldError("card-number", "El número de tarjeta debe tener entre 13 y 19 dígitos. Verifica que sea correcto.");
    valid = false;
  }

  if (document.getElementById("address").value.trim().length < 5) {
    setFieldError("address", "La dirección debe tener al menos 5 caracteres. Ejemplo: Calle 100 #45-67, Bogotá.");
    valid = false;
  }

  if (!document.getElementById("payment-method").value) {
    setFieldError("payment-method", "Selecciona un método de pago para continuar.");
    valid = false;
  }

  return valid;
}

// ── Checkout ───────────────────────────────────────────────────────────────

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideBanner(orderSuccessBanner);
  hideBanner(orderErrorBanner);

  if (!validateForm()) return;

  if (cart.length === 0) {
    showBanner(orderErrorBanner, "Tu carrito está vacío. Agrega libros al carrito antes de finalizar la compra.");
    return;
  }

  const customer = {
    fullName:      sanitizeText(document.getElementById("full-name").value),
    email:         document.getElementById("email").value.trim(),
    phone:         document.getElementById("phone").value.trim(),
    deliveryDate:  document.getElementById("delivery-date").value,
    cardNumber:    document.getElementById("card-number").value,
    address:       sanitizeText(document.getElementById("address").value),
    paymentMethod: document.getElementById("payment-method").value,
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  setButtonLoading(submitBtn, true, "Procesando pedido...");

  const result = await createOrder({ customer, items: cart, total });
  setButtonLoading(submitBtn, false, "Confirmar pedido");

  if (result.ok) {
    const { orderId, estimatedDelivery } = result.data;
    showBanner(orderSuccessBanner, `¡Pedido confirmado! Tu número de orden es ${orderId}. Entrega estimada: ${estimatedDelivery}.`);
    cart = [];
    renderCart();
    checkoutForm.reset();
  } else {
    showBanner(orderErrorBanner, result.message);
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────

function setButtonLoading(btn, loading, text) {
  btn.disabled = loading;
  btn.textContent = text;
}

function showBanner(el, message) {
  el.textContent = message;
  el.classList.remove("hidden");
}

function hideBanner(el) {
  el.classList.add("hidden");
  el.textContent = "";
}
