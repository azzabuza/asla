// MODIFIED: Converted to a standard ES module with exports

export function el(tag, htmlOrText, attrs = {}) {
  const n = document.createElement(tag);
  if (htmlOrText != null) {
    if (/(<\w+)/.test(String(htmlOrText))) n.innerHTML = htmlOrText;
    else n.textContent = htmlOrText;
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else n.setAttribute(k, v);
  }
  return n;
}

export function fmtDate(iso) {
  if (!iso) return "-";
  try {
    // Handles YYYY-MM-DD format correctly
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function idr(num) {
  return (num || 0).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

export function qparam(name) {
  return new URLSearchParams(location.search).get(name);
}

export function badge(status) {
  const statusMap = {
    submitted: ["Menunggu", "warn"],
    approved: ["Disetujui", "success"],
    rejected: ["Ditolak", "danger"],
  };
  const [label, cls] = statusMap[status] || [String(status), ""];
  const badgeElement = el("span", label, { class: `badge ${cls}` });
  return badgeElement;
}
