"use strict";
(() => {
/* ===== VISUALIZAÇÃO E DOWNLOAD DO CURRÍCULO ===== */
(() => {
  const modal = document.getElementById("modalCurriculo");
  const abrir = document.getElementById("abrirCurriculo");
  const fechar = document.getElementById("fecharCurriculo");
  if (!modal || !abrir || !fechar) return;
  abrir.addEventListener("click", () => modal.showModal());
  fechar.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
  });
  // Escape, foco e acessibilidade são controlados nativamente por <dialog>.
})();
})();
