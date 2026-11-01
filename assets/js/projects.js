"use strict";
(() => {
/* ==================== GALERIAS DOS PROJETOS ==================== */
// As miniaturas usam somente imagens reais cadastradas no HTML.
// Ao adicionar outra imagem, basta duplicar um botão .projeto-miniatura.
document.querySelectorAll(".projeto-galeria").forEach((card) => {
  const capa = card.querySelector(".projeto-capa img");
  const miniaturas = [...card.querySelectorAll(".projeto-miniatura")].filter(
    (botao) => botao.querySelector("img[src]"),
  );
  const anterior = card.querySelector(".projeto-anterior");
  const proximo = card.querySelector(".projeto-proximo");
  const progresso = card.querySelector(".projeto-progresso");

  if (!capa || miniaturas.length === 0) return;
  card.classList.toggle("galeria-multipla", miniaturas.length > 1);

  let selecionado = 0;
  function mostrar(indice) {
    selecionado = (indice + miniaturas.length) % miniaturas.length;
    const origem = miniaturas[selecionado].querySelector("img");
    capa.src = origem.getAttribute("src");
    capa.alt =
      origem.getAttribute("alt") || `Imagem ${selecionado + 1} do projeto`;

    miniaturas.forEach((botao, i) => {
      const ativo = i === selecionado;
      botao.classList.toggle("ativa", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
    });

    if (progresso) {
      progresso.style.width = `${100 / miniaturas.length}%`;
      progresso.style.transform = `translateX(${selecionado * 100}%)`;
    }
  }

  miniaturas.forEach((botao, indice) => {
    botao.addEventListener("click", () => mostrar(indice));
  });
  anterior?.addEventListener("click", () => mostrar(selecionado - 1));
  proximo?.addEventListener("click", () => mostrar(selecionado + 1));
  mostrar(0);

  // Evita que um link de demonstração ainda não configurado navegue para '#'.
  card
    .querySelector('.projeto-link[href="#"]')
    ?.addEventListener("click", (evento) => {
      evento.preventDefault();
    });
});

/* ==================== DESCRIÇÃO COMPLETA ==================== */
// A prévia ocupa sempre o mesmo espaço no card. O texto completo fica acessível.
(() => {
  const dialogo = document.createElement("dialog");
  dialogo.className = "projeto-descricao-dialog";
  const titulo = document.createElement("h3");
  const texto = document.createElement("p");
  const fechar = document.createElement("button");
  fechar.className = "projeto-dialog-fechar";
  fechar.type = "button";
  fechar.textContent = "Fechar";
  fechar.addEventListener("click", () => dialogo.close());
  dialogo.append(titulo, texto, fechar);
  document.body.append(dialogo);
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });

  const itens = [...document.querySelectorAll(".projeto-galeria")].map(
    (card) => ({
      descricao: card.querySelector(".projeto-descricao"),
      botao: card.querySelector(".projeto-ler-mais"),
      nome:
        card.querySelector(".projeto-cabecalho h3")?.textContent || "Projeto",
    }),
  );

  function verificarTextosLongos() {
    itens.forEach(({ descricao, botao }) => {
      if (!descricao || !botao) return;
      botao.hidden = descricao.scrollHeight <= descricao.clientHeight + 2;
    });
  }

  itens.forEach(({ descricao, botao, nome }) => {
    if (!descricao || !botao) return;
    botao.addEventListener("click", () => {
      titulo.textContent = nome;
      texto.textContent = descricao.textContent.trim();
      dialogo.showModal();
      fechar.focus();
    });
  });

  window.addEventListener("resize", verificarTextosLongos);
  window.addEventListener("load", verificarTextosLongos);
  document.fonts?.ready.then(verificarTextosLongos);
  verificarTextosLongos();
})();

(() => {
  const modal = document.getElementById("modalProjeto");
  const iframe = document.getElementById("iframeProjeto");
  const titulo = document.getElementById("modalTitulo");
  const link = document.getElementById("abrirProjeto");
  const fechar = document.getElementById("fecharProjeto");
  if (!modal || !iframe || !titulo || !link || !fechar) return;

  let botaoAnterior = null;
  document.querySelectorAll(".btn-ver-projeto").forEach((botao) => {
    botao.addEventListener("click", () => {
      const url = botao.dataset.url;
      // Somente demonstrações internas previstas no projeto são permitidas.
      if (!url || !/^demo\/(mindflow|escolar)\/index\.html$/.test(url)) return;
      botaoAnterior = botao;
      const nome = botao.dataset.nome || "Demonstração";
      titulo.textContent = nome;
      iframe.title = `Demonstração interativa do ${nome}`;
      link.href = url;
      iframe.src = url;
      modal.showModal();
      fechar.focus();
    });
  });

  fechar.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
  });
  // Também é disparado ao pressionar Escape: libera o iframe e devolve o foco.
  modal.addEventListener("close", () => {
    iframe.removeAttribute("src");
    botaoAnterior?.focus({ preventScroll: true });
  });
})();
})();
