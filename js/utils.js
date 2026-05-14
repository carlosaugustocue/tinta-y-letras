// js/utils.js

export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone) {
  return /^[\d\s\-\+\(\)]{7,15}$/.test(phone.trim());
}

export function validateCardNumber(number) {
  const digits = String(number).replace(/\s/g, "");
  return /^\d{13,19}$/.test(digits);
}

export function sanitizeText(str) {
  return String(str).trim().replace(/[<>]/g, "");
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export function getMinDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}
