
// Bot para agendamento de consultas, usando o mesmo layout do bot antigo

(function () {
  const mensagensEl = document.getElementById("mensagens");
  const inputEl = document.getElementById("mensagemInput");
  const enviarBtn = document.getElementById("enviarBtn");

  let etapa = 0;
  let dados = { paciente: "", medico: "", data: "", horario: "" };

  // Recebe os dados do paciente
  function addMensagem(texto, quem = "bot") {
    if (!mensagensEl) return;
    const div = document.createElement("div");
    div.className = quem === "bot" ? "mensagem-bot" : "mensagem-user";
    div.innerText = texto;
    mensagensEl.appendChild(div);
    mensagensEl.scrollTop = mensagensEl.scrollHeight;
  }

  //Aqui ele ira realizar uma consulta ao banco de dados, dando uma mensagem de erro caso não consigo realizar o agendamento, falta realizar a tabela e a rota
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
        addMensagem(`✅ Consulta com ${json.consulta.medico} agendada para ${json.consulta.data} às ${json.consulta.horario}.`, "bot");
      } else {
        addMensagem(`❌ Erro: ${json.erro || "Não foi possível agendar."}`, "bot");
      }
    } catch (err) {
      console.error(err);
      addMensagem("❌ Erro de rede ao tentar agendar.", "bot");
    }
  }

  //Realiza o agendamento
  function processaMensagemUsuario(texto) {
    if (etapa === 0) {
      dados.paciente = texto;
      etapa = 1;
      addMensagem(`Olá, ${dados.paciente}! Qual médico ou especialidade você deseja?`, "bot");
    } else if (etapa === 1) {
      dados.medico = texto;
      etapa = 2;
      addMensagem(`Perfeito. Para qual data? (Formato: YYYY-MM-DD)`, "bot");
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

  //Gera o evento quando o usuario clica ou pressiona
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

  // Mensagem inicial do bot
  addMensagem("Olá! Eu sou o bot de agendamento. Qual o seu nome completo?", "bot");
})();
