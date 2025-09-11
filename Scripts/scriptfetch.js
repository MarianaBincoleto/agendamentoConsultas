console.log('script.js carregado');

document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '1ab83bf0';
  const chatbotToggler = document.getElementById('chatbotToggler');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSendBtn = document.getElementById('chatbotSendBtn');
  const buttonsearch = document.querySelector('.buttonsearch');
  const searchInput = document.querySelector('.search-bar input');

  // O restante do seu código, por exemplo:
  chatbotToggler.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    chatbotWindow.setAttribute('aria-hidden', !chatbotWindow.classList.contains('active'));
    chatbotInput.focus();
  });

  chatbotCloseBtn.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
    chatbotWindow.setAttribute('aria-hidden', 'true');
    chatbotToggler.focus();
  });

  chatbotSendBtn.addEventListener('click', enviarMensagem);
  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enviarMensagem();
  });

  buttonsearch.addEventListener('click', () => {
    const termo = searchInput.value.trim();
    if (!termo) return alert('Por favor, digite um termo para buscar.');
    alert(`Busca por "${termo}" não está implementada ainda.`);
  });

  function enviarMensagem() {
    const texto = chatbotInput.value.trim();
    if (!texto) return;
    adicionarMensagem(texto, 'usuario');
    chatbotInput.value = '';
    responder(texto);
  }

  function adicionarMensagem(texto, remetente) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', remetente);
    msgDiv.textContent = texto;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function responder(texto) {
    adicionarMensagem('Buscando informações sobre "' + texto + '"...', 'bot');
    try {
      const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(texto)}&apikey=${apiKey}&plot=full&lang=pt`);
      const data = await response.json();
      chatbotMessages.lastChild.textContent = ''; // limpa mensagem temporária

      if (data.Response === 'True') {
        adicionarMensagem(`${data.Title} (${data.Year}) - Nota: ${data.imdbRating}`, 'bot');
        if (data.Poster && data.Poster !== 'N/A') {
          const img = document.createElement('img');
          img.src = data.Poster;
          img.alt = `Poster do filme ${data.Title}`;
          chatbotMessages.appendChild(img);
          chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        adicionarMensagem(data.Plot, 'bot');
      } else {
        adicionarMensagem('Não encontrei resultados para "' + texto + '".', 'bot');
      }
    } catch (error) {
      chatbotMessages.lastChild.textContent = 'Erro na busca. Tente novamente.';
    }
  }

});
