const form = document.getElementById("formCadastro");

const cpf = document.getElementById("cpf");
const telefone = document.getElementById("telefone");
const cep = document.getElementById("cep");
const resultado = document.getElementById("resultado");

// Remove todos os caracteres que não são números.
function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

// Máscara de CPF: 000.000.000-00
cpf.addEventListener("input", () => {
    let valor = somenteNumeros(cpf.value).slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpf.value = valor;
});

// Máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
telefone.addEventListener("input", () => {
    let valor = somenteNumeros(telefone.value).slice(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (valor.length > 6) {
        valor = valor.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    } else if (valor.length > 0) {
        valor = "(" + valor;
    }

    telefone.value = valor;
});

// Máscara de CEP: 00000-000
cep.addEventListener("input", () => {
    let valor = somenteNumeros(cep.value).slice(0, 8);

    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d+)$/, "$1-$2");
    }

    cep.value = valor;
});

// Verifica os dígitos verificadores do CPF.
function cpfValido(valor) {
    const numeros = somenteNumeros(valor);

    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(numeros[i]) * (10 - i);
    }

    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;

    if (digito !== Number(numeros[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(numeros[i]) * (11 - i);
    }

    digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;

    return digito === Number(numeros[10]);
}

// Valida os campos antes de simular o envio.
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Limpa a mensagem anterior.
    resultado.textContent = "";
    resultado.className = "mt-3";

    // Valida CPF.
    if (!cpfValido(cpf.value)) {
        cpf.setCustomValidity("Informe um CPF válido.");
    } else {
        cpf.setCustomValidity("");
    }

    // Valida telefone com DDD.
    const numeroTelefone = somenteNumeros(telefone.value);

    if (
        !(
            numeroTelefone.length === 11 &&
            /^[1-9]{2}9\d{8}$/.test(numeroTelefone)
        ) &&
        !(
            numeroTelefone.length === 10 &&
            /^[1-9]{2}[2-5]\d{7}$/.test(numeroTelefone)
        )
    ) {
        telefone.setCustomValidity("Confira o telefone e o DDD.");
    } else {
        telefone.setCustomValidity("");
    }

    // Valida a quantidade de números do CEP.
    if (somenteNumeros(cep.value).length !== 8) {
        cep.setCustomValidity("O CEP deve ter oito números.");
    } else {
        cep.setCustomValidity("");
    }

    // Aplica as mensagens visuais do Bootstrap.
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    resultado.textContent =
        "Cadastro validado com sucesso! Esta é uma demonstração: os dados não foram enviados nem armazenados.";

    resultado.classList.add("alert", "alert-success");

    // Não limpa o formulário para que seja possível conferir os dados.
});

// Remove erros personalizados quando os campos são alterados.
cpf.addEventListener("input", () => cpf.setCustomValidity(""));
telefone.addEventListener("input", () => telefone.setCustomValidity(""));
cep.addEventListener("input", () => cep.setCustomValidity(""));