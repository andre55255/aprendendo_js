function quizesGerenciar() {
    const selectQuiz = document.querySelector('select[name="gerenciarQuiz"]');
    if (!selectQuiz.children[1]) {
        $.ajax({
            url: "http://localhost:3000/quiz",
            method: "get",
            success: function(quizes) {
                if (quizes) {
                    quizes.forEach(quiz => {
                        selectQuiz.appendChild(criarOptions(quiz));
                    });
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
}

function criarTabelaPerg(dados, elemento) {
    const tabela = document.createElement('table');

    const tHead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const thQuiz = document.createElement('th');
    thQuiz.innerHTML = "Quiz";
    const thPerguntas = document.createElement('th');
    thPerguntas.innerHTML = "Perguntas";
    const thAcoes = document.createElement('th');
    thAcoes.innerHTML = "Ações";
    trHead.appendChild(thQuiz);
    trHead.appendChild(thPerguntas);
    trHead.appendChild(thAcoes);
    tHead.appendChild(trHead);

    const linhas = dados.perguntas.map(pergunta => {
        const tr = document.createElement('tr');

        const tdQuiz = document.createElement('td');
        tdQuiz.innerHTML = dados.quiz;

        const tdPerguntas = document.createElement('td');
        tdPerguntas.innerHTML = pergunta;

        const tdAcoes = document.createElement('td');

        const iconDel = document.createElement('i');
        iconDel.classList.add('fa', 'fa-trash', 'icon-del');
        
        const iconAlt = document.createElement('i');
        iconAlt.classList.add('fa', 'fa-pencil-alt', 'icon-alt');

        tdAcoes.appendChild(iconDel);
        tdAcoes.appendChild(iconAlt);

        tr.appendChild(tdQuiz);
        tr.appendChild(tdPerguntas);
        tr.appendChild(tdAcoes);

        return tr;
    });

    const tBody = document.createElement('tbody');
    linhas.forEach(linha => {
        tBody.appendChild(linha);
    });

    tabela.appendChild(tHead);
    tabela.appendChild(tBody);

    elemento.appendChild(tabela);
}

function getPergResp(e) {
    const quizSelecionado = e.target.options[e.target.selectedIndex].value;
    const quizAnterior = document.querySelector('.perguntas .tabela table tbody tr td');

    if (quizSelecionado && (quizAnterior === null) || (quizAnterior.innerHTML !== quizSelecionado)) {

        $.ajax({
            url: "http://localhost:3000/gerenciarPerguntas",
            method: "get",
            data: {
                quiz: quizSelecionado
            },
            success: function(resp) {
                const divTab = document.querySelector('.perguntas .tabela');
                if (divTab.children[0]) {
                    for(let child of divTab.children) {
                        child.remove();
                    }
                    criarTabelaPerg(resp, divTab);
                } else {
                    criarTabelaPerg(resp, divTab);
                }
                delPergunta();
                carregarPergResp();
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
}

function delPergunta() {
    const iconDeletar = document.querySelectorAll('.icon-del');

    iconDeletar.forEach(ele => {
        ele.addEventListener("click", function(e) {
            const quiz = e.target.parentNode.parentNode.children[0].innerHTML;
            const pergunta = e.target.parentNode.parentNode.children[1].innerHTML;

            $.ajax({
                url: "http://localhost:3000/questoes",
                method: "delete",
                data: {
                    quiz,
                    pergunta
                },
                success: function(resp) {
                    if (!resp.erro) {
                        alert('Pergunta excluída com sucesso!');
                        location.reload();
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    });
}

function formAlterarQuestao(dados) {
    const quiz = document.querySelector('[js-alt-quiz]');
    const pergunta = document.querySelector('[js-alt-perg]');
    const res1 = document.querySelector('[js-alt-res1]');
    const res2 = document.querySelector('[js-alt-res2]');
    const res3 = document.querySelector('[js-alt-res3]');
    const res4 = document.querySelector('[js-alt-res4]');

    pergunta.removeAttribute('disabled');
    res1.removeAttribute("disabled");
    res2.removeAttribute("disabled");
    res3.removeAttribute("disabled");
    res4.removeAttribute("disabled");

    quiz.value = dados.quiz;
    pergunta.value = dados.pergunta;

    function trueOuFalse(res, val) {
        res.value = val ? 'true' : 'false';
    } 

    res1.value = dados.respostas[0].descricao;
    trueOuFalse(res1.nextElementSibling, dados.respostas[0].correta);
    res2.value = dados.respostas[1].descricao;
    trueOuFalse(res2.nextElementSibling, dados.respostas[1].correta);
    res3.value = dados.respostas[2].descricao;
    trueOuFalse(res3.nextElementSibling, dados.respostas[2].correta);
    res4.value = dados.respostas[3].descricao;
    trueOuFalse(res4.nextElementSibling, dados.respostas[3].correta);

    alterarPergsResp();
}

function carregarPergResp() {
    const icoAlterar = document.querySelectorAll('.icon-alt');

    icoAlterar.forEach(ele => {
        ele.addEventListener("click", function(e) {
            const quiz = e.target.parentNode.parentNode.children[0].innerHTML;
            const pergunta = e.target.parentNode.parentNode.children[1].innerHTML;

            $.ajax({
                url: "http://localhost:3000/questoes",
                method: "get",
                data: {
                    quiz,
                    pergunta
                },
                success: function(resp) {
                    if (resp) {
                        formAlterarQuestao(resp);
                    }
                },
                error: function(err) {
                    console.log(err);
                } 
            });
        });
    });
}

function alterarPergsResp() {
    const btn = document.querySelector('[js-alt]');
    btn.removeAttribute('disabled');
    const pergAnt = document.querySelector('[js-alt-perg]').value;

    btn.addEventListener("click", function(e) {
        const form = e.target.parentNode;

        const dados = new FormData(form);
        dados.set("quiz", form.children[1].value);
        dados.set("pergAnt", pergAnt);

        validarPergResp(dados);

        $.ajax({
            url: "http://localhost:3000/questoes",
            method: "patch",
            data: new URLSearchParams(dados),
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            success: function(resp) {
                alert(resp);
                location.reload();
            },
            error: function(err) {
                console.log(err);
            }
        })
    });
}