function cadastrarCategoria(e) {
    e.preventDefault();

    const form = document.querySelector('form[name="add_category"]');
    const dados = new FormData(form);

    if (!dados.get('categoria')) {
        emitirAlerta('Gentileza preencher os dados do formulário!');
        return;
    }

    $.ajax({
        url: "http://localhost:3003/categorias",
        method: "post",
        enctype: "multipart/form-data",
        data: new URLSearchParams(dados),
        processData: false, // impedir que o jQuery tranforma a "data" em querystring
        contentType: false,// desabilitar o cabeçalho "Content-Type"
        cache: false,
        success: function(data) {
            if(data.sucesso) {
                emitirAlerta(`Categoria ${data.categoria} cadastrada com sucesso!`, true);
                form.reset();
            } else {
                emitirAlerta(`${data.erro}`);
                console.log(data.erro);
            }
        },
        error: function(err) {
            emitirAlerta('Ocorreu um erro!', false);
            console.log(err);
        }
    });
}

function emitirAlerta(msg, sucesso=false) {
    const div = document.createElement('div');
    div.classList.add('alert' , 'col-6' , 'offset-3');
    div.setAttribute('role', 'alert');
    div.innerHTML = msg;

    if(sucesso) {
        div.classList.add('alert-success');
    } else {
        div.classList.add('alert-danger');
    }

    const alertSetado = document.querySelector('[jsDestino] > div[role="alert"]');
    const alertSet = document.querySelector('[jsDestino]');

    if(alertSetado != null) {
        alertSetado.remove();
    }

    alertSet.appendChild(div);
}