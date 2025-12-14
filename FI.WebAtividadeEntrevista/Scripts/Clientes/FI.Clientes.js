function maskCPF(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

function maskCEP(v) {
    v = v.replace(/\D/g, "");
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

$(document).ready(function () {

    $(document).on("input", ".cpf-mask", function () {
        this.value = maskCPF(this.value);
    });

    $(document).on("input", ".cep-mask", function () {
        this.value = maskCEP(this.value);
    });

    $(document).on("input", ".tel-mask", function () {
        this.value = maskTelefone(this.value);
    });

    $("#formCadastro").on("submit", function (e) {
        e.preventDefault();

        const email = $("#Email").val();

        if (!validarEmailSimples(email)) {
            ModalDialog("Atenção", "O e-mail deve conter '@'");
            $("#Email").focus();
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
                Nacionalidade: $("#Nacionalidade").val()
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
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

function ModalDialog(titulo, texto) {
    const id = Math.random().toString().replace('.', '');

    const modal =
        `<div id="${id}" class="modal fade">
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
        </div>`;

    $("body").append(modal);
    $("#" + id).modal("show");
}
