const registerForm = document.querySelector("#registerForm");

// Adiciona evento de submit ao formulário
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const Name = document.querySelector("#userName");
    const Email = document.querySelector("#userEmail");
    const Password = document.querySelector("#userPassword");
    const ConfPassword = document.querySelector("#userConfPassword");
    let isValid = true; // Variável para verificar se o formulário é válido

    if (Name.value === "") {
        alert("Por favor, preencha seu nome");
        isValid = false;
    }
    if (Email.value === "" || !EmailValid(Email.value)) {
        alert("Por favor, preencha seu e-mail corretamente");
        isValid = false;
    }
    if (!validatePassword(Password.value, 8)) {
        alert("A senha deve ter no mínimo 8 dígitos");
        isValid = false;
    }
    if (Password.value !== ConfPassword.value) {
        alert("As senhas não são iguais");
        isValid = false;
    }

    // Se todas as validações forem aprovadas, submeter o formulário
    if (isValid) {
        const usuario = {
            login : Name.value,
            email: Email.value,
            senha: Password.value
        };
        console.log(usuario);
        try {
            // Fazendo o fetch para cadastrar o usuário
            const response = await fetch('https://localhost:7032/Usuario', {  // URL da API
                method: 'POST',
                //mode: 'no-cors', // Isso evita o bloqueio do CORS, mas limita a resposta
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)  // Converte o objeto em JSON
            });

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = '../index.html';
            } else {
                const errorMessage = await response.text();
                alert(`Erro ao cadastrar: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor.');
        }
    }
});

// Função para validar o e-mail
function EmailValid(Email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(Email);
}

// Função para validar a senha
function validatePassword(Password, minDigits) {
    return Password.length >= minDigits;
}