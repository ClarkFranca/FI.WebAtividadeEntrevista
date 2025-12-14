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

    if (beneficiarios.some((b, i) => b.CPF === novoCPF && i !== index)) {
        ModalDialog("Atenção", "Já existe um beneficiário com este CPF.");
        return;
    }

    beneficiarios[index].CPF = novoCPF;
    beneficiarios[index].Nome = novoNome;

    atualizarTabelaBenef();
}


function editarBeneficiario(index) {
    indiceEdicaoBenef = index;

    $('#editCPF').val(beneficiarios[index].CPF);
    $('#editNome').val(beneficiarios[index].Nome);

    $('#modalEditarBenef').modal('show');
}

function salvarEdicaoBeneficiario() {
    var cpf = $('#editCPF').val();
    var nome = $('#editNome').val();

    if (beneficiarios.some((b, i) => b.CPF === cpf && i !== indiceEdicaoBenef)) {
        ModalDialog("Atenção", "Já existe outro beneficiário com este CPF.");
        return;
    }

    beneficiarios[indiceEdicaoBenef] = {
        CPF: cpf,
        Nome: nome
    };

    $('#modalEditarBenef').modal('hide');
    atualizarTabelaBenef();
}

function removerBeneficiario(index) {
    beneficiarios.splice(index, 1);
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

        if (beneficiarios.some(b => b.CPF === cpf)) {
            ModalDialog("Atenção", "Já existe um beneficiário com este CPF.");
            return;
        }

        beneficiarios.push({
            CPF: cpf,
            Nome: nome
        });

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

    if (typeof obj !== "undefined" && obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
    }

    $("#Email").on("blur", function () {
        if (!validarEmailSimples(this.value)) {
            ModalDialog("Atenção", "O e-mail deve conter '@'");
            this.focus();
        }
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                NOME: $(this).find("#Nome").val(),
                CEP: $(this).find("#CEP").val(),
                Email: $(this).find("#Email").val(),
                Sobrenome: $(this).find("#Sobrenome").val(),
                Nacionalidade: $(this).find("#Nacionalidade").val(),
                Estado: $(this).find("#Estado").val(),
                Cidade: $(this).find("#Cidade").val(),
                Logradouro: $(this).find("#Logradouro").val(),
                Telefone: $(this).find("#Telefone").val(),
                CPF: $(this).find("#CPF").val(),
                Beneficiarios: beneficiarios
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
    });
});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var html = `
        <div id="${random}" class="modal fade">
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
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(html);
    $('#' + random).modal('show');
}
