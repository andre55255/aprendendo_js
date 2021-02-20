function certo(e) {
    const opcaoSelecionada = e.target.options[e.target.selectedIndex].text;
    if (e.target.classList.value) {
        e.target.classList.remove(e.target.classList.value);
    }
    if (opcaoSelecionada === "Sim") {
        e.target.classList.add('certo');
    } else if (opcaoSelecionada === "Não") {
        e.target.classList.add('errado');
    }
}

function criarOptions(value) {
    const opt = document.createElement('option');
    opt.innerHTML = value;
    opt.value = value;

    return opt;
}

function carregarQuiz() {
    const selectQuiz = document.querySelector('select[name="quiz"]');
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

function validarPergResp(dados) {
    if (!dados.get('quiz')) {
        alert('Gentileza selecionar o quiz ao qual pertence a pergunta!');
        return
    }

    if (!dados.get('pergunta')) {
        alert('Gentileza informar a pergunta!');
        return
    }

    if (!dados.get('resp1') && !dados.get('certo1') 
        && !dados.get('resp2') && !dados.get('certo2') 
        && !dados.get('resp3') && !dados.get('certo3') 
        && !dados.get('resp4') && !dados.get('certo4')) {

            alert('Gentileza fornecer as informações sobre as respostas!');
            return;
    }

    if (dados.get('certo1') === 'false' && dados.get('certo2') === 'false'
        && dados.get('certo3') === 'false' && dados.get('certo4') === 'false') {
            alert('Deve haver ao menos uma resposta correta!');
            return;
        }

    if (dados.get('certo1') === 'true' && dados.get('certo2') === 'true'
        || dados.get('certo1') === 'true' && dados.get('certo3') === 'true'
        || dados.get('certo1') === 'true' && dados.get('certo4') === 'true'

        || dados.get('certo2') === 'true' && dados.get('certo3') === 'true'
        || dados.get('certo2') === 'true' && dados.get('certo4') === 'true'
        
        || dados.get('certo3') === 'true' && dados.get('certo4') === 'true') {
            alert('Deve haver apenas uma resposta certa!');
            return;
        }
}

function setQuestao(e) {
    const form = e.target.parentNode;

    const dados = new FormData(form);
    
    validarPergResp(dados);
    
    $.ajax({
        url: 'http://localhost:3000/questoes',
        method: 'post',
        enctype: 'multipart/form-data',
        data: new URLSearchParams(dados),
        processData: false,
        contentType: false,
        cache: false,
        success: function(resp) {
            if (!resp.erro) {
                alert('Pergunta cadastrada com sucesso!');
                form.reset();
            }
        },
        error: function(err) {
            console.log(err);
            alert('Não foi possível inserir a questão!');
        }
    });
}