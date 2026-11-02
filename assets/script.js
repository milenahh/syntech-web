// Cotizador de Syntech Solutions.
// Precios en COP. Dominio .com en COP con el 10 % de margen incluido.
const PRICES = {
  base: 350000,
  page: 60000,
  // Dominio .com: primer año + renovaciones acumuladas (1 a 5 años)
  domainCom: [38900, 102600, 166300, 230000, 293700]
};

const el = id => document.getElementById(id);

function cop(n) {
  return "$" + Math.round(n).toLocaleString("es-CO") + " COP";
}

function recalc() {
  const items = [];

  if (el("baseChk").checked) {
    items.push({ label: "Landing de una página", value: PRICES.base });
  }

  const qty = parseInt(el("pagesQty").value || "0", 10);
  if (qty > 0) {
    items.push({ label: qty + " página(s) adicional(es)", value: qty * PRICES.page });
  }

  const domNote = el("domNote");
  const domPrice = el("domPrice");
  const ext = el("domExt").value;
  const years = parseInt(el("domYears").value, 10);

  if (ext === ".com") {
    domNote.textContent = "Renovación anual: $63.700 COP. El total incluye la renovación de los años elegidos.";
    domPrice.textContent = cop(PRICES.domainCom[years - 1]) + " total";
  } else {
    domNote.textContent = "El precio de esta extensión se confirma al cotizar.";
    domPrice.textContent = "Por cotizar";
  }

  if (el("domChk").checked) {
    const value = ext === ".com" ? PRICES.domainCom[years - 1] : 0;
    items.push({ label: "Dominio " + ext + ", " + years + " año(s)", value: value });
  }

  if (el("mntChk").checked) {
    const plan = el("mntPlan").value;
    items.push({ label: "Mantenimiento " + plan + " meses", value: 0 });
  }

  if (el("ecomChk").checked) {
    items.push({ label: "E-commerce (tienda en línea)", value: 0 });
  }

  render(items);
}

function render(items) {
  const summary = el("summary");
  summary.classList.toggle("is-hidden", items.length === 0);
  if (items.length === 0) return;

  const ul = el("lines");
  ul.innerHTML = "";
  let total = 0;
  let pending = false;

  items.forEach(item => {
    const li = document.createElement("li");
    const left = document.createElement("span");
    left.textContent = item.label;
    const right = document.createElement("span");
    if (item.value > 0) {
      right.textContent = cop(item.value);
      total += item.value;
    } else {
      right.textContent = "Por cotizar";
      pending = true;
    }
    li.appendChild(left);
    li.appendChild(right);
    ul.appendChild(li);
  });

  el("total").textContent = "Total: " + cop(total) + (pending ? " + lo que está por cotizar" : "");
  el("fine").textContent = pending
    ? "Los servicios marcados como 'Por cotizar' se confirman al enviar la solicitud."
    : "Precio sujeto a confirmación. Dominios en USD convertidos a COP según la TRM del día.";
}

const WA_NUMBER = "573193757476";

function quoteLines() {
  return [...document.querySelectorAll("#lines li")].map(li => li.innerText.replace(/\n/g, " - "));
}

function openQuoteForm() {
  const lines = quoteLines();
  if (lines.length === 0) return;
  const ul = el("quoteItems");
  ul.innerHTML = "";
  lines.forEach(t => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
  const modal = el("quoteModal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  el("qName").focus();
}

function closeQuoteForm() {
  el("quoteModal").hidden = true;
  document.body.style.overflow = "";
}

function sendQuoteWhatsApp(e) {
  e.preventDefault();
  const name = el("qName").value.trim();
  const phone = el("qPhone").value.trim();
  const email = el("qEmail").value.trim();
  const biz = el("qBiz").value.trim();
  const total = el("total").textContent;
  const msg = "Hola Syntech Solutions, quiero una solicitud:\n\n" +
    "Nombre: " + name + "\n" +
    "Teléfono: " + phone + "\n" +
    (email ? "Correo: " + email + "\n" : "") +
    (biz ? "Negocio: " + biz + "\n" : "") +
    "\nServicios:\n" + quoteLines().map(l => "- " + l).join("\n") +
    "\n\n" + total;
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  closeQuoteForm();
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeQuoteForm(); });

document.addEventListener("DOMContentLoaded", recalc);
