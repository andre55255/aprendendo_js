function getQuizJogar(e) {
    const quizSelecionado = e.target.options[e.target.selectedIndex].value;
    const qtdQuestoes = document.querySelector('input[name="qtd-questoes"]');
    
    $.ajax({
        url: "http://localhost:3000/jogar",
        method: "get",
        data: {
            quiz: quizSelecionado
        },
        success: function(resp) {
            if (resp) {
                qtdQuestoes.value = `Este quiz possui ${resp.questoes.length / 4} questões`;
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function mostrarQuestoes(ele, questao) {

    ele.children[0].innerHTML = questao[0].pergunta;

    for(let i=0; i<ele.children[1].children.length; i++) {
        const input = document.createElement('input');
        input.type = "radio";
        input.name = "opcao";
        $(ele.children[1].children[i]).empty();
        ele.children[1].children[i].appendChild(input);
        ele.children[1].children[i].insertAdjacentText('beforeend', questao[i].resposta);
    }
    
    $(ele).fadeIn(400);
}

function finalizou(ele, acertos, qtdQuestoes) {
    const qtdQues = document.querySelector('[js-qtd-questoes]');
    const acert = document.querySelector('[js-qtd-acertos]');
    const erros = document.querySelector('[js-qtd-erros]');

    qtdQues.innerHTML = qtdQuestoes;
    acert.innerHTML = acertos;
    erros.innerHTML = parseInt(qtdQuestoes) - parseInt(acertos);

    const btnVoltar = document.querySelector('[js-voltar-jogo]');
    btnVoltar.addEventListener("click", function(e) {
        location.reload();
    });

    $(ele).fadeIn(400);
}

function jogo(e) {
    const select = document.querySelector('[js-jogo-quiz]');
    const areaJogo = document.querySelector('.jogar');

    $.ajax({
        url: "http://localhost:3000/jogar",
        method: "get",
        data: {
            quiz: select.options[select.selectedIndex].value
        },
        success: function(resp) {
            areaJogo.children[0].children[0].innerHTML = `Quiz - ${resp.quiz}`;
            areaJogo.children[1].remove();

            function filtrar(array, filtro) {
                return array.filter(ele => ele.pergunta === filtro);
            }
            
            let questoesAgrupadas = [];
            for(let i=0; i<resp.questoes.length; i+=4) {
                questoesAgrupadas.push(filtrar(resp.questoes, resp.questoes[i].pergunta));
            }

            localStorage.setItem('questao', 0);
            mostrarQuestoes(document.querySelector('.jogar .questoes'), questoesAgrupadas[localStorage.getItem('questao')]);

            let inputRadio = document.querySelectorAll('input[name="opcao"]');
            let acertou = 0;

            
            document.querySelector('[js-btn-passar]').addEventListener("click", function(e) {
                let marcou = false;
                inputRadio.forEach(i => {
                    if(i.checked) {
                        marcou = true;
                    }
                });

                if (!marcou) {
                    alert('Selecione uma opção!');
                    return;
                }
                
                let ls = localStorage.getItem('questao');
                inputRadio = document.querySelectorAll('input[name="opcao"]');
                
                for(let i=0; i<4; i++) {
                    let correta = questoesAgrupadas[ls][i].correta;
                    let marcada = inputRadio[i].checked;
                    
                    if (correta && correta === marcada) {
                        acertou += 1;
                    }
                }

                if (questoesAgrupadas[parseInt(ls)+1]) {
                    localStorage.setItem('questao', parseInt(ls)+1);
                    mostrarQuestoes(document.querySelector('.jogar .questoes'), questoesAgrupadas[localStorage.getItem('questao')]);
                } else {
                    document.querySelector('.jogar .questoes').style.display = "none";
                    finalizou(document.querySelector('.jogar .finalizou'), acertou, questoesAgrupadas.length);
                }
            });  
        },
        error: function(err) {
            console.log(err);
        }
    });
}