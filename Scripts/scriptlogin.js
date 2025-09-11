document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Impede o envio tradicional do formulário

    // Captura os valores dos campos de entrada
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Cria o objeto DTO com os dados
    const loginData = {
        Email: email,
        Password: password
    }; 

    try {
        
        // Faz a requisição fetch para a rota de login da API
        // const response = await fetch('https://localhost:7032/Login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        //     },
        //     body: JSON.stringify(loginData) // Envia o objeto convertido em JSON
        // });

        // Verifica se a resposta foi bem-sucedida
        if (email === "mariana" && password === "1234") {
            // const result = await response.json();
            // console.log('Login bem-sucedido:', result);
            // Redireciona ou faz alguma ação após o login bem-sucedido
            window.location.href = 'Pages/home.html';
        } else {
            // Trata os erros, como credenciais inválidas
            console.error('Erro no login:', response.status);
            alert('Erro no login. Verifique suas credenciais.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro na requisição.');
    }
});
