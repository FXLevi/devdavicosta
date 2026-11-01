"use strict";
(() => {
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ==================== TEMA CLARO / ESCURO ==================== */
const botaoTema = document.querySelector(".toggle");
const checkboxTema = document.getElementById("switch");
const sistemaTema = window.matchMedia("(prefers-color-scheme: light)");
let animandoTema = false;

function temaArmazenado() {
  try {
    const tema = localStorage.getItem("theme");
    return tema === "light" || tema === "dark" ? tema : null;
  } catch (_) {
    return null;
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem("theme", tema);
  } catch (_) {
    // Bloqueio de armazenamento não deve impedir a troca de tema.
  }
}

function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  document.documentElement.style.colorScheme = tema;
  const metaTema = document.querySelector('meta[name="theme-color"]');
  if (metaTema) metaTema.content = tema === "light" ? "#f0eee6" : "#141413";

  // Marcado = tema escuro = exibir lua ao alternar para ele.
  if (checkboxTema) {
    checkboxTema.checked = tema === "dark";
    checkboxTema.setAttribute(
      "aria-label",
      tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro",
    );
  }
}

// Sincroniza o ícone com a preferência já aplicada no <head>.
aplicarTema(document.documentElement.dataset.theme);

// Pequena lua/sol sai do botão antes de revelar as novas cores.
async function animarAstro(temaDestino) {
  if (!botaoTema || movimentoReduzido.matches) return;

  const seletor = temaDestino === "dark" ? ".icon--moon" : ".icon--sun";
  const desenho = botaoTema.querySelector(`${seletor} svg`);
  if (!desenho) return;

  const area = botaoTema.getBoundingClientRect();
  const astro = document.createElement("span");
  astro.className = "tema-astro";
  astro.setAttribute("aria-hidden", "true");
  astro.style.left = `${area.left + area.width / 2}px`;
  astro.style.top = `${area.top + area.height / 2}px`;
  astro.appendChild(desenho.cloneNode(true));
  document.body.appendChild(astro);

  try {
    await astro.animate(
      [
        { opacity: 0.98, transform: "translate(-50%, -50%) scale(0.65)" },
        {
          opacity: 1,
          transform: "translate(-50%, -85%) scale(1.16)",
          offset: 0.55,
        },
        { opacity: 0, transform: "translate(-50%, -110%) scale(1.4)" },
      ],
      {
        duration: 190,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "forwards",
      },
    ).finished;
  } catch (_) {
    // Uma animação cancelada não deve bloquear a alternância.
  } finally {
    astro.remove();
  }
}

async function mudarTemaComOnda(temaDestino) {
  const temaAtual = document.documentElement.dataset.theme;
  if (animandoTema || temaDestino === temaAtual) return;

  animandoTema = true;
  if (checkboxTema) checkboxTema.disabled = true;

  try {
    const podeAnimar =
      !movimentoReduzido.matches &&
      typeof document.startViewTransition === "function";

    if (!podeAnimar) {
      // Sem View Transitions: cores interpoladas suavemente quando permitido.
      if (!movimentoReduzido.matches) {
        document.documentElement.classList.add("tema-fallback");
      }
      aplicarTema(temaDestino);
      if (!movimentoReduzido.matches) {
        await new Promise((resolver) => setTimeout(resolver, 380));
        document.documentElement.classList.remove("tema-fallback");
      }
      return;
    }

    await animarAstro(temaDestino);

    const area = botaoTema?.getBoundingClientRect();
    const x = area ? area.left + area.width / 2 : innerWidth / 2;
    const y = area ? area.top + area.height / 2 : innerHeight / 2;
    const raioFinal = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    const transicao = document.startViewTransition(() =>
      aplicarTema(temaDestino),
    );
    await transicao.ready;

    // Revela um recorte circular da página INTEIRA, incluindo o rodapé.
    document.documentElement.animate(
      {
        clipPath: [
          `circle(16px at ${x}px ${y}px)`,
          `circle(${raioFinal}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 850,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
    await transicao.finished;
  } catch (_) {
    // Alguns navegadores bloqueiam/cancelam transições durante a navegação.
    aplicarTema(temaDestino);
  } finally {
    document.documentElement.classList.remove("tema-fallback");
    animandoTema = false;
    if (checkboxTema) checkboxTema.disabled = false;
  }
}

checkboxTema?.addEventListener("change", () => {
  if (animandoTema) return;

  // O checkbox muda antes do evento; restaurá-lo evita capturar o ícone errado.
  const temaAtual = document.documentElement.dataset.theme;
  const destino = temaAtual === "dark" ? "light" : "dark";
  checkboxTema.checked = temaAtual === "dark";
  salvarTema(destino);
  void mudarTemaComOnda(destino);
});

function acompanharSistema(evento) {
  if (!temaArmazenado() && !animandoTema) {
    aplicarTema(evento.matches ? "light" : "dark");
  }
}

sistemaTema.addEventListener("change", acompanharSistema);
})();
