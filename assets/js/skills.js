"use strict";
(() => {
/* ==================== HABILIDADES ==================== */
const habilidades = {
  backend: [
    { nome: "Java", imagem: "img/java_icon.svg" },
    { nome: "Python", imagem: "img/python.svg" },
    { nome: "PHP", imagem: "img/php_icon.svg" },
  ],
  frontend: [
    { nome: "HTML", imagem: "img/html_icon.svg" },
    { nome: "CSS", imagem: "img/css_icon.svg" },
    { nome: "JavaScript", imagem: "img/javascript_icon.svg" },
    { nome: "Tailwind", imagem: "img/tailwind_icon.svg" },
  ],
  database: [
    { nome: "MySQL", imagem: "img/mysql_icon.svg" },
    { nome: "PostgreSQL", imagem: "img/postgresql_icon.svg" },
  ],
  ferramentas: [
    { nome: "Git", imagem: "img/git_icon.svg" },
    { nome: "GitHub", imagem: "img/github_icon.svg" },
    { nome: "Docker", imagem: "img/docker_icon.svg" },
    { nome: "IntelliJ", imagem: "img/intellij-icon.svg" },
    { nome: "VS Code", imagem: "img/vscode_icon.svg" },
    { nome: "Figma", imagem: "img/figma_icon.svg" },
  ],
};


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
    imagem.width = 52;
    imagem.height = 52;
    imagem.decoding = "async";

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

  botao.addEventListener("click", () => ativarCategoria(botao));
  botao.addEventListener("keydown", (evento) => {
    const teclas = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!teclas.includes(evento.key)) return;
    evento.preventDefault();
    const posicao = [...categorias].indexOf(botao);
    const proxima = evento.key === "Home" ? 0 : evento.key === "End" ? categorias.length - 1 :
      (posicao + (["ArrowRight", "ArrowDown"].includes(evento.key) ? 1 : -1) + categorias.length) % categorias.length;
    categorias[proxima].focus();
    ativarCategoria(categorias[proxima]);
  });
});

function ativarCategoria(botao) {
  categorias.forEach((item) => {
    const ativa = item === botao;
    item.classList.toggle("ativa", ativa);
    item.setAttribute("aria-selected", String(ativa));
    item.tabIndex = ativa ? 0 : -1;
  });
  painel?.setAttribute("aria-labelledby", botao.id);
  mostrarHabilidades(botao.dataset.categoria);
}

if (categorias.length) ativarCategoria(categorias[0]);
})();
