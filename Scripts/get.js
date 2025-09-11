const url = "https://localhost:7032/Filme?skip=0&take=50";

  // Função para buscar dados da API
  const fetchFilmes = async () => {
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Erro na requisição: ' + response.status);
          }

          const data = await response.json(); // Converte a resposta para JSON
          console.log('Data:', data); // Exibe os dados retornados pela API
          exibirFilmes(data); // Chama a função para exibir filmes
      } catch (error) {
          console.error('Erro:', error); // Exibe erros, caso ocorram
      }
  };

  // Função para exibir filmes no DOM
  const exibirFilmes = (filmes) => {
      const filmeContainer = document.getElementById('filmeContainer');

      // Verifica se o container foi encontrado
      if (!filmeContainer) {
          console.error('Container de filmes não encontrado.');
          return;
      }

      // Verifica se os dados retornados são um array
      if (!Array.isArray(filmes)) {
          console.error('Os dados retornados não são um array:', filmes);
          return;
      }

      // Itera sobre cada filme no array de dados retornado
      filmes.forEach(filme => {
          // Verifica se todas as propriedades esperadas estão presentes
          if (!filme.titulo || !filme.duracao || !filme.genero || !filme.horaDaConsulta || !filme.caminho) {
              console.error('Filme com dados incompletos:', filme);
              return; // Ignora filmes com dados incompletos
          }

          // Cria elementos HTML para cada filme
          const filmeElement = document.createElement('div');
          filmeElement.classList.add('filme');

          // Criação dos elementos para exibir informações do filme
          filmeElement.innerHTML = `
            <div class="filme">
              <h2>${filme.titulo}</h2>            
              <img src="${filme.caminho}" alt="${filme.titulo}" />
              <p>Duração: ${filme.duracao} minutos</p>
              <p>Gênero: ${filme.genero}</p>
              </div>
          `;

          // Adiciona o elemento do filme ao container principal
          filmeContainer.appendChild(filmeElement);
      });
  };

  // Chama a função para buscar filmes
  fetchFilmes();