
// Bot para agendamento de consultas
(function () {
  const chatbotWindow = document.getElementById("chatbotWindow");
  const toggler = document.getElementById("chatbotToggler");
  const closeBtn = document.getElementById("chatbotCloseBtn");

  const mensagensEl = document.getElementById("chatbotMessages");
  const inputEl = document.getElementById("chatbotInput");
  const enviarBtn = document.getElementById("chatbotSendBtn");

  let etapa = 0;
  let dados = { paciente: "", medico: "", data: "", horario: "" };

  // Adiciona mensagens no chat
  function addMensagem(texto, quem = "bot") {
    if (!mensagensEl) return;
    const div = document.createElement("div");
    div.className = quem === "bot" ? "mensagem-bot" : "mensagem-user";
    div.innerText = texto;
    mensagensEl.appendChild(div);

    // Scroll automático sempre para a última mensagem
    mensagensEl.scrollTop = mensagensEl.scrollHeight;
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

  // Lista de médicos disponíveis
const medicosDisponiveis = ["Dr. João - Cardiologista", "Dra. Maria - Pediatra", "Dr. Pedro - Ortopedista"];

// Função para exibir opções de médicos clicáveis
function mostrarOpcoesMedicos() {
  if (!mensagensEl) return;
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
      addMensagem(`Perfeito. Para qual data? (Formato: DD/MM/YYYY)`, "bot");
    });
    container.appendChild(btn);
  });

  mensagensEl.appendChild(container);
  mensagensEl.scrollTop = mensagensEl.scrollHeight; // scroll automático
}

// Ajustar a etapa do médico
function processaMensagemUsuario(texto) {
  if (etapa === 0) {
    dados.paciente = texto;
    etapa = 1;
    addMensagem(`Olá, ${dados.paciente}! Qual médico ou especialidade você deseja?`, "bot");
    mostrarOpcoesMedicos(); // mostra opções clicáveis
  } else if (etapa === 2) {
    dados.data = texto;
    etapa = 3;
    addMensagem(`Certo. Qual horário? (Ex: 14:30)`, "bot");
  } else if (etapa === 3) {
    dados.horario = texto;
    etapa = 0;
    addMensagem(`Confirmando: ${dados.medico} em ${dados.data} às ${dados.horario}.`, "bot");
    enviarAgendamento();
  }
}


  // Eventos do input
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

  // Função para resetar conversa
  function resetarConversa() {
    mensagensEl.innerHTML = ""; // limpa mensagens
    etapa = 0;
    dados = { paciente: "", medico: "", data: "", horario: "" };
    addMensagem("Olá! Eu sou o bot de agendamento. Qual o seu nome completo?", "bot");
  }

  // Controle de abrir/fechar chatbot
  toggler.addEventListener("click", () => {
    chatbotWindow.style.display = "block";
    chatbotWindow.setAttribute("aria-hidden", "false");
    resetarConversa();
  });

  closeBtn.addEventListener("click", () => {
    chatbotWindow.style.display = "none";
    chatbotWindow.setAttribute("aria-hidden", "true");
    resetarConversa(); // reseta ao fechar
  });

  // Mensagem inicial quando a página é carregada
  resetarConversa();
})();
