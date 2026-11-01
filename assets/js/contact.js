"use strict";
(() => {
/* ===== FORMULÁRIO DE CONTATO: ENVIO DIRETO VIA FORMSUBMIT ===== */
(() => {
  const modal = document.getElementById("modalContato");
  const fechar = document.getElementById("fecharContato");
  const formulario = document.getElementById("formContato");
  const enviar = document.getElementById("enviarContato");
  const status = document.getElementById("contatoStatus");
  if (!modal || !fechar || !formulario || !enviar || !status) return;

  // O primeiro envio aciona um e-mail de ativação do FormSubmit para o proprietário.
  // Depois que ele confirmar o endereço, as mensagens passam a ser encaminhadas.
  const urlAjax = "https://formsubmit.co/ajax/davict2007@gmail.com";
  const intervaloEntreEnvios = 60 * 1000;
  const chaveUltimoEnvio = "portfolio-contato-ultimo-envio";
  const tempoMinimoPreenchimento = 1500;
  const timeoutRequisicao = 12000;
  let instanteAbertura = 0;
  let enviando = false;
  let gatilhoAnterior = null;

  const exibirStatus = (mensagem, tipo) => {
    status.textContent = mensagem;
    status.className = `contato-status contato-status--${tipo}`;
    status.hidden = false;
    status.focus({ preventScroll: true });
  };

  const limparStatus = () => {
    status.textContent = "";
    status.hidden = true;
    status.className = "contato-status";
  };

  document.querySelectorAll(".abrir-contato").forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      evento.preventDefault();
      gatilhoAnterior = botao;
      limparStatus();
      instanteAbertura = Date.now();
      if (!modal.open) modal.showModal();
      formulario.elements.namedItem("nome")?.focus();
    });
  });

  const fecharModal = () => modal.close();
  modal.addEventListener("close", () => gatilhoAnterior?.focus({ preventScroll: true }));
  fechar.addEventListener("click", fecharModal);
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) fecharModal();
  });

  // Recupera o intervalo entre envios se o navegador permitir armazenamento local.
  const recuperarUltimoEnvio = () => {
    try { return Number(localStorage.getItem(chaveUltimoEnvio) || 0); }
    catch (_) { return 0; }
  };
  const registrarEnvio = () => {
    try { localStorage.setItem(chaveUltimoEnvio, String(Date.now())); }
    catch (_) { /* Sem armazenamento local, o envio continua disponível. */ }
  };

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (enviando || !formulario.reportValidity()) return;
    limparStatus();

    const dados = new FormData(formulario);
    const nome = String(dados.get("nome") || "").trim();
    const email = String(dados.get("email") || "").trim();
    const assunto = String(dados.get("assunto") || "").trim().replace(/[\r\n]+/g, " ");
    const mensagem = String(dados.get("mensagem") || "").trim();
    const honeypot = String(dados.get("_honey") || "").trim();
    const limiteNome = nome.length <= 100;
    const limiteEmail = email.length <= 150;
    const limiteAssunto = assunto.length <= 150;
    const limiteMensagem = mensagem.length <= 5000;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (honeypot) {
      exibirStatus("Não foi possível enviar a mensagem. Tente novamente.", "erro");
      return;
    }
    if (nome.length < 2 || !limiteNome || assunto.length < 3 || !limiteAssunto ||
        mensagem.length < 10 || !limiteMensagem || !emailValido || !limiteEmail) {
      exibirStatus("Preencha todos os campos corretamente antes de enviar.", "erro");
      return;
    }
    if (Date.now() - instanteAbertura < tempoMinimoPreenchimento) {
      exibirStatus("Aguarde um instante antes de enviar sua mensagem.", "aviso");
      return;
    }
    const tempoRestante = intervaloEntreEnvios - (Date.now() - recuperarUltimoEnvio());
    if (tempoRestante > 0) {
      exibirStatus(`Uma mensagem já foi enviada recentemente. Aguarde ${Math.ceil(tempoRestante / 1000)} segundos para enviar outra.`, "aviso");
      return;
    }

    enviando = true;
    enviar.disabled = true;
    enviar.classList.add("contato-enviar--ocupado");
    enviar.querySelector(".contato-enviar-texto").textContent = "Enviando...";
    status.hidden = false;
    status.className = "contato-status contato-status--aviso";
    status.textContent = "Enviando sua mensagem...";

    const controlador = new AbortController();
    const cronometro = setTimeout(() => controlador.abort(), timeoutRequisicao);
    try {
      const resposta = await fetch(urlAjax, {
        signal: controlador.signal,
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          assunto,
          mensagem,
          _subject: `Portfólio Davi Costa: ${assunto}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
          _honey: ""
        })
      });
      const resultado = await resposta.json();
      // FormSubmit pode retornar HTTP 200 com success: "false" (string).
      // Nunca considerar a resposta aceita apenas porque o HTTP foi bem-sucedido.
      const aceito = resposta.ok && (resultado.success === true || resultado.success === "true");
      if (!aceito) {
        const mensagemServico = String(resultado.message || "");
        if (/activat|confirm|verif/i.test(mensagemServico)) {
          exibirStatus("O formulário está aguardando ativação pelo proprietário do portfólio. Ainda não foi possível confirmar o envio da mensagem.", "aviso");
        } else {
          exibirStatus("Não foi possível confirmar o envio. Tente novamente em instantes ou use o e-mail alternativo abaixo.", "erro");
        }
        return;
      }

      registrarEnvio();
      formulario.reset();
      exibirStatus("Mensagem recebida pelo serviço de envio! Obrigado pelo contato. Responderei assim que possível.", "sucesso");
    } catch (erro) {
      const mensagem = erro?.name === "AbortError"
        ? "O serviço demorou a responder. O envio não pôde ser confirmado. Verifique seu e-mail antes de tentar novamente."
        : "Não foi possível confirmar o envio. Confira sua conexão e tente mais tarde, ou use o e-mail alternativo.";
      exibirStatus(mensagem, "erro");
    } finally {
      clearTimeout(cronometro);
      enviando = false;
      enviar.disabled = false;
      enviar.classList.remove("contato-enviar--ocupado");
      enviar.querySelector(".contato-enviar-texto").textContent = "Enviar mensagem";
    }
  });
})();
})();
