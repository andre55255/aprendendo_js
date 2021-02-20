function insereElementos(card, icon) {
    const fa = document.createElement('i');
    fa.classList.add('fa', `fa-${icon}`);
    fa.setAttribute("id", "fa");

    card.appendChild(fa);
}

function embaralhaCards() {
    function gerarNumerosNaoContido(array) {
        const min = 1;
        const max = 17;
        const novoNumero = parseInt(Math.random() * (max - min) + min);
        return array.includes(novoNumero) ? gerarNumerosNaoContido(array) : novoNumero;
    }

    const frenteCard = ['anchor', 'anchor', 'american-sign-language-interpreting', 'american-sign-language-interpreting', 'apple-alt', 'apple-alt', 'asterisk', 'asterisk', 'atom', 'atom', 'bug', 'bug', 'biohazard', 'biohazard', 'bone', 'bone'];

    const embaralhar = Array(16)
            .fill(0)
            .reduce(a => [...a, gerarNumerosNaoContido(a)], []);

    for(let i in embaralhar) {
        let cardFront = document.querySelector(`.c${embaralhar[i]} > .Card > .Front`);
        
        insereElementos(cardFront, frenteCard[i]);
    }

}

function fliparCard(card) {
    const x = document.querySelector(`.${card} > .Card`);

    x.classList.add('Flip');
}

function desviraCard(card1, card2) {
    let x = card1.split(' ');
    let y = card2.split(' ');

    let c1 = document.querySelectorAll(`.${x[1]}`);
    let c2 = document.querySelectorAll(`.${y[1]}`);

    c1.forEach(c => {
        c.parentNode.parentNode.classList.remove("Flip");
    });

    c2.forEach(c => {
        c.parentNode.parentNode.classList.remove("Flip");
    });

}

function acertouCard(card) {
    let x = card.split(' ');

    let c1 = document.querySelectorAll(`.${x[1]}`);

    c1.forEach(c => {
        c.classList.add("Fade-out");
        c.parentNode.classList.add("Certo");
    });
}

function vitoria() {
    setTimeout(() => {
        alert('Você venceu!');
        location.reload();
    }, 2000);
}

function jogo() {
    embaralhaCards();
    
    const cards = document.querySelectorAll('.Card');
    let cardAnt = null;
    let cardAtual = null;
    let quadranteSelecionado = null;
    let contagem = 0;

    cards.forEach(card => {
        card.addEventListener("click", function() {
            fliparCard(this.parentNode.classList.value);

            if (!cardAnt) {
                cardAnt = this.children[0].children[0].classList.value;
                quadranteSelecionado = this.parentNode.classList.value;
            } else if (cardAnt && !cardAtual) {
                if (this.parentNode.classList.value === quadranteSelecionado) {
                    return;
                } else {
                    cardAtual = this.children[0].children[0].classList.value;
                }
            }

            if (cardAnt === cardAtual) {
                setTimeout(() => {
                    acertouCard(cardAnt);
                    cardAnt = null;
                    cardAtual = null;
                    contagem++;
                    if (contagem === 8) {
                        vitoria();
                    }
                }, 300);
            } else if ((cardAnt && cardAtual) && (cardAnt != cardAtual)) {
                setTimeout(() => {
                    desviraCard(cardAnt, cardAtual);
                    cardAnt = null;
                    cardAtual = null;
                }, 500);
            }

        });
    });
}

jogo();