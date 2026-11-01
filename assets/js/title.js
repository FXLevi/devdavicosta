"use strict";
(() => {
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ==================== ANIMAÇÃO DO TÍTULO ==================== */
const titulo = document.getElementById("titulo");
const linhasTitulo = [1, 2, 3].map((numero) =>
  document.getElementById(`titulo-linha-${numero}`),
);

if (titulo && linhasTitulo.every(Boolean)) {
  const [linha1, linha2, linha3] = linhasTitulo;
  const textoFinal = ["Olá, eu sou o", "Davi Costa", "Desenvolvedor Backend"];
  const saudacao = "Olá, mundo";
  const cursor = document.createElement("span");
  cursor.className = "titulo-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "|";

  // As três linhas são permanentes: o texto nunca modifica a altura do título.
  function escreverLinha(elemento, texto, destacar = false) {
    elemento.replaceChildren();

    // Destaca Davi Costa juntos, mantendo o mesmo tamanho das demais linhas.
    const conteudo = destacar ? document.createElement("span") : elemento;
    if (destacar) {
      conteudo.className = "destaque";
      elemento.append(conteudo);
    }
    conteudo.textContent = texto;
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

    // A versão sem JS já exibe o título completo; a animação começa após o carregamento.
    linhasTitulo.forEach((linha) => linha.replaceChildren());
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
})();
