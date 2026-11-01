"use strict";

/* ==================== HABILIDADES ==================== */
const habilidades = {
  backend: [
    { nome: "java", imagem: "img/java_icon.svg" },
    { nome: "python", imagem: "img/python.svg" },
    { nome: "php", imagem: "img/php_icon.svg" },
  ],
  frontend: [
    { nome: "html", imagem: "img/html_icon.svg" },
    { nome: "css", imagem: "img/css_icon.svg" },
    { nome: "javascript", imagem: "img/javascript_icon.svg" },
    { nome: "tailwind", imagem: "img/tailwind_icon.svg" },
  ],
  database: [
    { nome: "mysql", imagem: "img/mysql_icon.svg" },
    { nome: "postgreSQL", imagem: "img/postgresql_icon.svg" },
  ],
  ferramentas: [
    { nome: "git", imagem: "img/git_icon.svg" },
    { nome: "gitHub", imagem: "img/github_icon.svg" },
    { nome: "docker", imagem: "img/docker_icon.svg" },
    { nome: "intelliJ", imagem: "img/intellij-icon.svg" },
    { nome: "vs Code", imagem: "img/vscode_icon.svg" },
    { nome: "figma", imagem: "img/figma_icon.svg" },
    { nome: "xampp", imagem: "img/xampp_icon.svg" },
  ],
};

const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");

const categorias = document.querySelectorAll(".categoria");
const painel = document.getElementById("cardsHabilidades");

function mostrarHabilidades(categoria) {
  if (!painel || !habilidades[categoria]) return;

  const cards = habilidades[categoria].map((habilidade) => {
    const card = document.createElement("div");
    card.classList.add("card-habilidade");

    const imagem = document.createElement("img");
    imagem.src = habilidade.imagem;
    imagem.alt = "";

    const nome = document.createElement("span");
    nome.textContent = habilidade.nome;
    card.append(imagem, nome);
    return card;
  });

  painel.replaceChildren(...cards);
}

categorias.forEach((botao) => {
  const categoria = botao.dataset.categoria;
  const contador = botao.querySelector(".contador");
  if (contador && habilidades[categoria]) {
    contador.textContent = habilidades[categoria].length;
  }

  botao.addEventListener("click", () => {
    categorias.forEach((item) => {
      const ativa = item === botao;
      item.classList.toggle("ativa", ativa);
      item.setAttribute("aria-selected", String(ativa));
    });
    mostrarHabilidades(categoria);
  });
});

mostrarHabilidades("backend");

/* ==================== ANIMAÇÃO DO TÍTULO ==================== */
const titulo = document.getElementById("titulo");
const linhasTitulo = [1, 2, 3].map((numero) =>
  document.getElementById(`titulo-linha-${numero}`),
);

if (titulo && linhasTitulo.every(Boolean)) {
  const [linha1, linha2, linha3] = linhasTitulo;
  const textoFinal = ["Olá, eu sou o Davi", "Costa", "Desenvolvedor Backend"];
  const saudacao = "Olá, mundo";
  const cursor = document.createElement("span");
  cursor.className = "titulo-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "|";

  // As três linhas são permanentes: o texto nunca modifica a altura do título.
  function escreverLinha(elemento, texto) {
    elemento.replaceChildren();

    if (elemento === linha1) {
      const prefixo = "Olá, eu sou o ";

      if (texto.length > prefixo.length) {
        elemento.append(document.createTextNode(prefixo));

        const davi = document.createElement("span");
        davi.className = "destaque";
        davi.textContent = texto.slice(prefixo.length);

        elemento.append(davi);
      } else {
        elemento.append(document.createTextNode(texto));
      }
    } else if (elemento === linha2) {
      const costa = document.createElement("span");
      costa.className = "destaque";
      costa.textContent = texto;

      elemento.append(costa);
    } else {
      elemento.append(document.createTextNode(texto));
    }

    elemento.append(cursor);
  }
  function esperar(ms) {
    return new Promise((resolver) => setTimeout(resolver, ms));
  }

  async function digitar(elemento, texto, destacar = false) {
    for (let i = 1; i <= texto.length; i++) {
      escreverLinha(elemento, texto.slice(0, i), destacar);
      await esperar(55);
    }
  }

  async function iniciarTitulo() {
    if (movimentoReduzido.matches) {
      linhasTitulo.forEach((linha, i) =>
        escreverLinha(linha, textoFinal[i], i === 1),
      );
      return;
    }

    // A saudação surge na terceira linha, no lugar de "Desenvolvedor Backend".
    await esperar(400);
    await digitar(linha3, saudacao);
    await esperar(850);

    // Apaga a saudação e transporta o cursor para a primeira linha.
    for (let i = saudacao.length - 1; i >= 0; i--) {
      escreverLinha(linha3, saudacao.slice(0, i));
      await esperar(32);
    }
    linha3.replaceChildren();
    linha1.append(cursor);
    await esperar(260);

    // Digita nas três linhas, sem deslocar a descrição, os botões ou a foto.
    for (let i = 0; i < textoFinal.length; i++) {
      await digitar(linhasTitulo[i], textoFinal[i], i === 1);
      if (i < textoFinal.length - 1) await esperar(180);
    }
  }

  void iniciarTitulo();
}

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
  const capaArea = card.querySelector(".projeto-capa");
  const faixaMiniaturas = card.querySelector(".projeto-miniaturas");

  if (!capa || miniaturas.length === 0) return;
  card.classList.toggle("galeria-multipla", miniaturas.length > 1);

  let selecionado = 0;
  function mostrar(indice) {
    selecionado = (indice + miniaturas.length) % miniaturas.length;
    const origem = miniaturas[selecionado].querySelector("img");
    // As miniaturas são versões leves; a capa usa a imagem completa (data-full).
    capa.src = origem.dataset.full || origem.getAttribute("src");
    capa.alt =
      origem.getAttribute("alt") || `Imagem ${selecionado + 1} do projeto`;

    miniaturas.forEach((botao, i) => {
      const ativo = i === selecionado;
      botao.classList.toggle("ativa", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
    });

    // Rola apenas a faixa horizontal, sem mover a página ao carregar o site.
    if (faixaMiniaturas) {
      const alvo = miniaturas[selecionado];
      const deslocamento =
        alvo.offsetLeft -
        faixaMiniaturas.offsetLeft -
        (faixaMiniaturas.clientWidth - alvo.clientWidth) / 2;
      faixaMiniaturas.scrollTo({
        left: Math.max(0, deslocamento),
        behavior: movimentoReduzido.matches ? "instant" : "smooth",
      });
    }
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
  // Troca de screenshot com gesto horizontal, sem bloquear a rolagem vertical.
  let inicioToque = null;
  capaArea?.addEventListener(
    "touchstart",
    (evento) => {
      if (evento.touches.length !== 1) return;
      inicioToque = {
        x: evento.touches[0].clientX,
        y: evento.touches[0].clientY,
      };
    },
    { passive: true },
  );
  capaArea?.addEventListener(
    "touchend",
    (evento) => {
      if (!inicioToque || !evento.changedTouches.length) return;
      const dx = evento.changedTouches[0].clientX - inicioToque.x;
      const dy = evento.changedTouches[0].clientY - inicioToque.y;
      inicioToque = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        mostrar(selecionado + (dx < 0 ? 1 : -1));
      }
    },
    { passive: true },
  );
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

  // Recalcula no máximo uma vez por quadro, evitando reflow a cada pixel redimensionado.
  let quadroPendente = false;
  window.addEventListener("resize", () => {
    if (quadroPendente) return;
    quadroPendente = true;
    requestAnimationFrame(() => {
      quadroPendente = false;
      verificarTextosLongos();
    });
  });
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

      if (!url) return;

      botaoAnterior = botao;
      titulo.textContent = botao.dataset.nome || "Projeto";
      iframe.src = url;
      link.href = url;

      modal.hidden = false;
      document.body.classList.add("modal-aberto");
      fechar.focus();
    });
  });

  function fecharModal() {
    modal.hidden = true;
    iframe.src = "about:blank";
    document.body.classList.remove("modal-aberto");
    botaoAnterior?.focus();
  }

  fechar.addEventListener("click", fecharModal);

  window.addEventListener("message", (evento) => {
    if (
      evento.origin !== window.location.origin ||
      evento.source !== iframe.contentWindow
    )
      return;
    if (evento.data?.tipo === "fechar-galeria" && !modal.hidden) fecharModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) fecharModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      fecharModal();
    }
  });
})();

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

/* ===== CONTATO POR E-MAIL (SEM SERVIDOR) ===== */
(() => {
  const destinatario = "davict2007@gmail.com";
  const modal = document.getElementById("modalContato");
  const fechar = document.getElementById("fecharContato");
  const formulario = document.getElementById("formContato");
  if (!modal || !fechar || !formulario) return;

  document.querySelectorAll(".abrir-contato").forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      evento.preventDefault();
      if (!modal.open) modal.showModal();
    });
  });
  fechar.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const dados = new FormData(formulario);
    const nome = String(dados.get("nome") || "").trim();
    const email = String(dados.get("email") || "").trim();
    const assunto = String(dados.get("assunto") || "").trim();
    const mensagem = String(dados.get("mensagem") || "").trim();
    if (!nome || !email || !assunto || !mensagem) return;

    const corpo = `Olá, Davi!\n\n${mensagem}\n\n---\nNome: ${nome}\nE-mail para resposta: ${email}`;
    // O usuário confirma o envio no cliente de e-mail. Não exibir falsa confirmação de envio.
    window.location.href = `mailto:${destinatario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  });
})();

/* ==================== MENU MOBILE ==================== */
(() => {
  const cabecalho = document.querySelector(".portfolio-header");
  const botao = document.querySelector(".menu-toggle");
  const navegacao = document.getElementById("menuNavegacao");
  if (!cabecalho || !botao || !navegacao) return;
  const abrir = (estado) => {
    cabecalho.classList.toggle("menu-aberto", estado);
    botao.setAttribute("aria-expanded", String(estado));
    botao.setAttribute("aria-label", estado ? "Fechar menu" : "Abrir menu");
  };
  botao.addEventListener("click", () =>
    abrir(botao.getAttribute("aria-expanded") !== "true"),
  );
  navegacao
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => abrir(false)));
  document.addEventListener("pointerdown", (evento) => {
    if (
      cabecalho.classList.contains("menu-aberto") &&
      !cabecalho.contains(evento.target)
    )
      abrir(false);
  });
  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      cabecalho.classList.contains("menu-aberto")
    ) {
      abrir(false);
      botao.focus();
    }
  });
  window
    .matchMedia("(min-width: 801px)")
    .addEventListener("change", (evento) => {
      if (evento.matches) abrir(false);
    });
})();
