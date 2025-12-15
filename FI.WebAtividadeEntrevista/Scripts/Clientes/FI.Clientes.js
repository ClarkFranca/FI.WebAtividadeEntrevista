var beneficiarios = [];
var indiceEdicaoBenef = null;

function maskCPF(v) {
    v = v.replace(/\D/g, "");
    v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

function maskCEP(v) {
    v = v.replace(/\D/g, "");
    v = v.substring(0, 8);
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v;
}

function maskTelefone(v) {
    v = v.replace(/\D/g, "");

    if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d)/, "($1) $2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        v = v.replace(/(\d{2})(\d)/, "($1) $2");
        v = v.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return v;
}

function validarEmailSimples(email) {
    return email.includes("@");
}

function atualizarTabelaBenef() {
    var tbody = $('#listaBeneficiarios');
    tbody.empty();

    if (beneficiarios.length === 0) {
        tbody.append(`
            <tr class="text-muted">
                <td colspan="3" class="text-center">
                    Nenhum beneficiário incluído
                </td>
            </tr>
        `);
        return;
    }

    $.each(beneficiarios, function (i, b) {
        tbody.append(`
            <tr data-index="${i}">
                <td class="cpf">${b.CPF}</td>
                <td class="nome">${b.Nome}</td>
                <td class="text-center acoes">
                   <div class="row">
                        <button type="button"
                                class="btn btn-primary btn-sm"
                                onclick="editarBenefInline(${i})">
                            Alterar
                        </button>
                        <button type="button"
                            class="btn btn-primary btn-sm"
                            onclick="removerBeneficiario(${i})">
                         Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function editarBenefInline(index) {

    if (indiceEdicaoBenef !== null && indiceEdicaoBenef !== index) {
        atualizarTabelaBenef();
    }

    indiceEdicaoBenef = index;

    var linha = $(`tr[data-index="${index}"]`);
    var beneficiario = beneficiarios[index];

    linha.find('.cpf').html(`
        <input type="text"
               class="form-control input-sm cpf-mask"
               value="${beneficiario.CPF}">
    `);

    linha.find('.nome').html(`
        <input type="text"
               class="form-control input-sm"
               value="${beneficiario.Nome}">
    `);

    linha.find('.acoes').html(`
        <button type="button"
                class="btn btn-success btn-sm"
                onclick="salvarEdicaoInline(${index})">
            Salvar
        </button>
    `);
}

function salvarEdicaoInline(index) {
    var linha = $(`tr[data-index="${index}"]`);
    var novoCPF = linha.find('.cpf input').val();
    var novoNome = linha.find('.nome input').val();

    if (!novoCPF || !novoNome) {
        ModalDialog("Atenção", "Informe CPF e Nome.");
        return;
    }

    if (!cpfValido(novoCPF)) {
        ModalDialog("Atenção", "CPF inválido.");
        return;
    }

    if (beneficiarios.some((b, i) => b.CPF === novoCPF && i !== index)) {
        ModalDialog("Atenção", "Já existe um beneficiário com este CPF.");
        return;
    }

    beneficiarios[index].CPF = novoCPF;
    beneficiarios[index].Nome = novoNome;

    indiceEdicaoBenef = null;
    atualizarTabelaBenef();
}

function removerBeneficiario(index) {
    beneficiarios.splice(index, 1);
    indiceEdicaoBenef = null;
    atualizarTabelaBenef();
}


$(document).ready(function () {

    $(document).on('click', '#btnIncluirBenef', function () {
        var cpf = $('#benefCPF').val();
        var nome = $('#benefNome').val();

        if (!cpf || !nome) {
            ModalDialog("Atenção", "Informe CPF e Nome do beneficiário.");
            return;
        }

        if (!cpfValido(cpf)) {
            ModalDialog("Atenção", "CPF do beneficiário inválido.");
            return;
        }

        if (beneficiarios.some(b => b.CPF === cpf)) {
            ModalDialog("Atenção", "Já existe um beneficiário com este CPF.");
            return;
        }

        beneficiarios.push({ CPF: cpf, Nome: nome });

        atualizarTabelaBenef();

        $('#benefCPF').val('');
        $('#benefNome').val('');
    });

    $(document).on("input", ".cpf-mask", function () {
        this.value = maskCPF(this.value);
    });

    $(document).on("input", ".cep-mask", function () {
        this.value = maskCEP(this.value);
    });

    $(document).on("input", ".tel-mask", function () {
        this.value = maskTelefone(this.value);
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var email = $("#Email").val();
        var cpfCliente = $("#CPF").val();

        if (!validarEmailSimples(email)) {
            ModalDialog("Atenção", "O e-mail deve conter '@'");
            $("#Email").focus();
            return;
        }

        if (!cpfValido(cpfCliente)) {
            ModalDialog("Atenção", "CPF do cliente inválido.");
            $("#CPF").focus();
            return;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                Nome: $("#Nome").val(),
                Sobrenome: $("#Sobrenome").val(),
                Email: email,
                CPF: $("#CPF").val(),
                Telefone: $("#Telefone").val(),
                CEP: $("#CEP").val(),
                Logradouro: $("#Logradouro").val(),
                Cidade: $("#Cidade").val(),
                Estado: $("#Estado").val(),
                Nacionalidade: $("#Nacionalidade").val(),
                Beneficiarios: beneficiarios
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                beneficiarios = [];
                atualizarTabelaBenef();
            },
            error: function (r) {
                if (r.status === 400)
                    ModalDialog("Erro", r.responseJSON);
                else if (r.status === 500)
                    ModalDialog("Erro", "Erro interno no servidor.");
            }
        });
    });
});

function cpfValido(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11)
        return false;

    if (/^(\d)\1+$/.test(cpf))
        return false;

    var soma = 0;
    var resto;

    for (var i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11)
        resto = 0;

    if (resto !== parseInt(cpf.substring(9, 10)))
        return false;

    soma = 0;
    for (var i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11)
        resto = 0;

    if (resto !== parseInt(cpf.substring(10, 11)))
        return false;

    return true;
}


function ModalDialog(titulo, texto) {
    var id = Math.random().toString().replace('.', '');

    var modal = `
        <div id="${id}" class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">×</button>
                        <h4 class="modal-title">${titulo}</h4>
                    </div>
                    <div class="modal-body">
                        <p>${texto}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modal);
    $('#' + id).modal('show');
}
