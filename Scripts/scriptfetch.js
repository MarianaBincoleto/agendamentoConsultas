// scriptfetch.js
// Bot de agendamento usando a interface já existente na página home

(function () {
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotSendBtn = document.getElementById("chatbotSendBtn");
  const chatbotToggler = document.getElementById("chatbotToggler");
  const chatbotCloseBtn = document.getElementById("chatbotCloseBtn");

  let etapa = 0;
  let dados = { paciente: "", medico: "", data: "", horario: "" };

  // Abre/fecha o chatbot
  chatbotToggler.addEventListener("click", () => {
    chatbotWindow.setAttribute("aria-hidden", "false");
    chatbotWindow.style.display = "block";
  });

  chatbotCloseBtn.addEventListener("click", () => {
    chatbotWindow.setAttribute("aria-hidden", "true");
    chatbotWindow.style.display = "none";
  });

  // Adiciona mensagens ao chat
  function addMensagem(texto, quem = "bot") {
    const div = document.createElement("div");
    div.className = quem === "bot" ? "mensagem-bot" : "mensagem-user";
    div.innerText = texto;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Envia os dados para o backend
  async function enviarAgendamento() {
    addMensagem("⏳ Agendando sua consulta...", "bot");
    try {
      const res = await fetch("/api/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await res.json();
      if (res.ok && json.sucesso) {
        addMensagem(
          `✅ Consulta com ${json.consulta.medico} agendada para ${json.consulta.data} às ${json.consulta.horario}.`,
          "bot"
        );
      } else {
        addMensagem(
          `❌ Erro: ${json.erro || "Não foi possível agendar."}`,
          "bot"
        );
      }
    } catch (err) {
      console.error(err);
      addMensagem("❌ Erro de rede ao tentar agendar.", "bot");
    }
  }

  // Fluxo do bot
  function processaMensagemUsuario(mensagem) {
    if (etapa === 0) {
      dados.paciente = mensagem;
      etapa = 1;
      addMensagem(
        `Olá, ${dados.paciente}! Qual médico ou especialidade você deseja?`,
        "bot"
      );
    } else if (etapa === 1) {
      dados.medico = mensagem;
      etapa = 2;
      addMensagem(`Perfeito. Para qual data? (Formato: YYYY-MM-DD)`, "bot");
    } else if (etapa === 2) {
      dados.data = mensagem;
      etapa = 3;
      addMensagem(`Certo. Qual horário? (Ex: 14:30)`, "bot");
    } else if (etapa === 3) {
      dados.horario = mensagem;
      etapa = 0;
      addMensagem(
        `Confirmando: ${dados.medico} em ${dados.data} às ${dados.horario}.`,
        "bot"
      );
      enviarAgendamento();
    }
  }

  // Envio de mensagens
  function enviarMensagem() {
    const mensagem = chatbotInput.value.trim();
    if (!mensagem) return;
    addMensagem(mensagem, "user");
    chatbotInput.value = "";
    processaMensagemUsuario(mensagem);
  }

  chatbotSendBtn.addEventListener("click", enviarMensagem);
  chatbotInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      enviarMensagem();
      e.preventDefault();
    }
  });

  // Mensagem inicial
  addMensagem(
    "Olá! Eu sou o bot de agendamento. Qual o seu nome completo?",
    "bot"
  );
})();
