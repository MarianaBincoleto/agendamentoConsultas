// Bot para agendamento de consultas
(function () {
  const chatbotWindow = document.getElementById("chatbotWindow");
  const toggler = document.getElementById("chatbotToggler");
  const closeBtn = document.getElementById("chatbotCloseBtn");

  const mensagensEl = document.getElementById("chatbotMessages");
  const inputEl = document.getElementById("chatbotInput");
  const enviarBtn = document.getElementById("chatbotSendBtn");

  let etapa = 0;
  let dados = { paciente: "", medico: "", unidade: "", data: "", horario: "" };

  // Lista de médicos disponíveis
  const medicosDisponiveis = [
    "Dr. João - Cardiologista",
    "Dra. Maria - Pediatra",
    "Dr. Pedro - Ortopedista",
    "Dr. Carla - Geriatra"
  ];

  // Lista de unidades
  const unidadesDisponiveis = [
    "Mary Dota",
    "Bela Vista",
    "Centro",
    "Independência"
  ];

  // Adiciona mensagens no chat
  function addMensagem(texto, quem = "bot") {
    if (!mensagensEl) return;
    const div = document.createElement("div");
    div.className = quem === "bot" ? "mensagem-bot" : "mensagem-user";
    div.innerText = texto;
    mensagensEl.appendChild(div);
    mensagensEl.scrollTop = mensagensEl.scrollHeight;
  }

  // Exibe opções de médicos clicáveis
  function mostrarOpcoesMedicos() {
    const container = document.createElement("div");
    container.className = "opcoes-medicos";

    medicosDisponiveis.forEach((medico) => {
      const btn = document.createElement("button");
      btn.className = "botao-medico";
      btn.innerText = medico;
      btn.addEventListener("click", () => {
        dados.medico = medico;
        etapa = 2;
        addMensagem(`Você escolheu: ${medico}`, "user");
        addMensagem(`Agora escolha a unidade de atendimento:`, "bot");
        mostrarOpcoesUnidades();
      });
      container.appendChild(btn);
    });

    mensagensEl.appendChild(container);
    mensagensEl.scrollTop = mensagensEl.scrollHeight;
  }

  // Exibe opções de unidades clicáveis
  function mostrarOpcoesUnidades() {
    const container = document.createElement("div");
    container.className = "opcoes-unidades";

    unidadesDisponiveis.forEach((unidade) => {
      const btn = document.createElement("button");
      btn.className = "botao-unidade";
      btn.innerText = unidade;
      btn.addEventListener("click", () => {
        dados.unidade = unidade;
        etapa = 3;
        addMensagem(`Unidade escolhida: ${unidade}`, "user");
        addMensagem(`Perfeito. Para qual data? (Formato: DD/MM/YYYY)`, "bot");
      });
      container.appendChild(btn);
    });

    mensagensEl.appendChild(container);
    mensagensEl.scrollTop = mensagensEl.scrollHeight;
  }

  // Processa a mensagem do usuário
  function processaMensagemUsuario(texto) {
    if (etapa === 0) {
      dados.paciente = texto;
      etapa = 1;
      addMensagem(`Olá, ${dados.paciente}! Qual médico ou especialidade você deseja?`, "bot");
      mostrarOpcoesMedicos();
    } else if (etapa === 3) {
      dados.data = texto;
      etapa = 4;
      addMensagem(`Certo. Qual horário desejado? (Ex: 14:30)`, "bot");
    } else if (etapa === 4) {
      dados.horario = texto;
      etapa = 0;
      addMensagem(
        `Confirmando: ${dados.medico}, ${dados.unidade}, em ${dados.data} às ${dados.horario}.`,
        "bot"
      );
      enviarAgendamento();
    }
  }

  // Envia dados simulando agendamento
  async function enviarAgendamento() {
    addMensagem("⏳ Agendando sua consulta...", "bot");
    try {
      const res = await fetch("/api/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const json = await res.json();
      if (res.ok && json.sucesso) {
        addMensagem(
          `✅ Consulta com ${json.consulta.medico} agendada para ${json.consulta.data} às ${json.consulta.horario} na unidade ${json.consulta.unidade}.`,
          "bot"
        );
      } else {
        addMensagem(`❌ Erro: ${json.erro || "Não foi possível agendar."}`, "bot");
      }
    } catch (err) {
      console.error(err);
      addMensagem("❌ Erro de rede ao tentar agendar.", "bot");
    }
  }

  // Reseta a conversa
  function resetarConversa() {
    mensagensEl.innerHTML = "";
    etapa = 0;
    dados = { paciente: "", medico: "", unidade: "", data: "", horario: "" };
    addMensagem(
      "Olá! Eu sou o bot de agendamento de consultas médicas. Qual o seu nome completo para começarmos por favor?",
      "bot"
    );
  }

  // Input e envio de mensagens
  if (enviarBtn && inputEl) {
    enviarBtn.addEventListener("click", () => {
      const texto = inputEl.value.trim();
      if (!texto) return;
      addMensagem(texto, "user");
      processaMensagemUsuario(texto);
      inputEl.value = "";
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        enviarBtn.click();
        e.preventDefault();
      }
    });
  }

  // Controle abrir/fechar chatbot
  toggler.addEventListener("click", () => {
    chatbotWindow.style.display = "block";
    chatbotWindow.setAttribute("aria-hidden", "false");
    resetarConversa();
  });

  closeBtn.addEventListener("click", () => {
    chatbotWindow.style.display = "none";
    chatbotWindow.setAttribute("aria-hidden", "true");
    resetarConversa();
  });

  resetarConversa();
})();

