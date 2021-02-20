function emitirAlerta(msg, sucesso = false) {
    const p = document.createElement('p')
    p.innerHTML = msg;

    const alerta = document.querySelector('.alerta');

    if (alerta.firstChild) {
        alerta.firstChild.remove();
    }

    if (sucesso) {
        alerta.classList.add('sucesso');
        alerta.appendChild(p);
    } else {
        alerta.classList.add('erro');
        alerta.appendChild(p);
    }
}

function setQuiz(e) {
    const form = e.target.parentNode.parentNode;
    const dados = new FormData(form);
    
    if (!dados.get('nomeQuiz')) {
        emitirAlerta('Gentileza fornecer a informação!');
    }
    
    $.ajax({
        url: 'http://localhost:3000/quiz',
        method: 'post',
        enctype: 'multipart/form-data',
        data: new URLSearchParams(dados),
        processData: false,
        contentType: false,
        cache: false,
        success: function(resp) {
            if (!resp.erro) {
                emitirAlerta('Quiz cadastrado com sucesso!', true);
                form.reset();
            }
        },
        error: function(err) {
            if (resp.erro) {
                emitirAlerta('Ocorreu um erro! ' + err);
            }
        }
    });
}

function criarTabelaQuizes(quizes, elementoPai) {
    const tabela = document.createElement('table');

    const tHead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const thNome = document.createElement('th');
    thNome.innerHTML = "Nome";
    const thSelecionar = document.createElement('th');
    thSelecionar.innerHTML = "Selecionar";
    trHead.appendChild(thNome);
    trHead.appendChild(thSelecionar);
    tHead.appendChild(trHead);

    const tBody = document.createElement('tbody');
    const linhas = quizes.map(quiz => {
        const tr = document.createElement('tr');
        const tdNome = document.createElement('td');
        tdNome.innerHTML = quiz;

        const tdSelec = document.createElement('td');
        const iconFa = document.createElement('i');
        iconFa.classList.add('fa', 'fa-hand-pointer', 'selecionar');
        iconFa.addEventListener("click", selecionaQuiz)
        tdSelec.appendChild(iconFa);

        tr.appendChild(tdNome);
        tr.appendChild(tdSelec);

        return tr;
    });

    linhas.forEach(linha => {
        tBody.appendChild(linha);
    });

    tabela.appendChild(tHead);
    tabela.appendChild(tBody);

    elementoPai.appendChild(tabela);
}

function getQuizes() {
    const destTabela = document.querySelector('.montar-quiz .tabela');

    if (!destTabela.children[0]) {
        $.ajax({
            url: "http://localhost:3000/quiz",
            method: "get",
            success: function(quizes) {
                criarTabelaQuizes(quizes, destTabela);
            },
            error: function(err) {
                console.log(err);
            }
        })
    }
}

function selecionaQuiz(e) {
    const quiz = e.target.parentNode.parentNode.children[0];

    const input = document.querySelector('input[name="nomeQuiz"]');
    input.value = quiz.innerHTML;

    input.setAttribute("disabled", "");

    const grupoBtns = document.querySelector('.grupo-btn')
    grupoBtns.children[0].setAttribute("disabled", "");
    grupoBtns.children[1].setAttribute("disabled", "");
    grupoBtns.children[2].removeAttribute("disabled");
    grupoBtns.children[3].removeAttribute("disabled");

    const alertas = document.querySelector('.alerta').children[0];
    const tabela = document.querySelector('.tabela').children[0];

    if (alertas) {
        alertas.remove();
    } else if (tabela) {
        tabela.remove();
    }
}

function updateQuizes(e) {
    const quiz = document.querySelector('input[name="nomeQuiz"]');
    const dados = new FormData();
    dados.set("antigo", quiz.value);

    quiz.removeAttribute("disabled");

    e.target.addEventListener("click", function(e) {
        dados.set("atual", quiz.value);

        $.ajax({
            url: "http://localhost:3000/quiz",
            method: "put",
            data: new URLSearchParams(dados),
            enctype: "multipart/form-data",
            processData: false,
            contentType: false,
            cache: false,
            success: function(resp) {
                alert('Quiz alterado com sucesso!');
                location.reload();
            },
            error: function(err) {
                console.log(err);
            } 
        })
    });
}

function deleteQuizes(e) {
    const quiz = document.querySelector('input[name="nomeQuiz"]');
    const dados = new FormData();
    dados.set('quiz', quiz.value);

    if(confirm('Deseja excluir este Quiz?')) {
        $.ajax({
            url: "http://localhost:3000/quiz",
            method: "delete",
            data: new URLSearchParams(dados),
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            success: function(res) {
                if (!res.erro) {
                    alert('Quiz excluído com sucesso!');
                    location.reload();
                } else {
                    alert('Este quiz possui questões relacionadas!');
                    location.reload();
                }
            },
            error: function(err) {
                console.log(err);
                alert('Ocorreu um erro!');
                location.reload();
            }
        })
    }
}