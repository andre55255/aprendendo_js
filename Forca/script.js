function iniciarJogo() {
    const palavra = document.querySelector('.escolher-palavra > input').value;
    if (!palavra) {
        alert('Gentileza informar a palavra!');
        return;
    }

    localStorage.setItem('palavra', palavra);

    const div = document.querySelector('.escolher-palavra');
    div.style.animation = "fadeOut 1s";
    div.addEventListener('animationend', function(e) {
        e.target.remove();
    });
    
    //////////////////////////////////////////////////////////

    const divJogo = document.querySelector('.conteudo .jogo');
    divJogo.style.display = "flex";

    const chave = localStorage.getItem('palavra').toUpperCase().split('');
    const qtdLetras = document.querySelector('.jogo .forca');
    for (let i=0; i<chave.length; i++) {
        const span = document.createElement('span');
        span.classList.add('letra');
        if (chave[i] === ' '){
            span.innerHTML = "-";
        } else {
            span.innerHTML = "_";
        }
        qtdLetras.appendChild(span);
    }

    localStorage.setItem("ganhou", 0);
    
    chave.forEach(letra => {
        if (letra === " ") {
            localStorage.setItem("ganhou", parseInt(localStorage.getItem('ganhou'))+1);
        }
    });

    function teclaPressionada(event) {
        const key = event.keyCode || event.which;
        return String.fromCharCode(key);
    }

    document.onkeypress = function(e) {
        const letra = teclaPressionada(e);

        const forca = document.querySelectorAll('.forca .letra');
        let existe = 0;


        for(let i=0; i<chave.length; i++) {
            if (chave[i].toUpperCase() === letra.toUpperCase()) {
                forca[i].innerHTML = letra.toUpperCase();
                localStorage.setItem("ganhou", parseInt(localStorage.getItem('ganhou'))+1);
                existe++;
            }
        }

        function spanLetraErrada(letra) {
            const span = document.createElement('span');
            span.classList.add('letra');
            span.innerHTML = `${letra}-`;
            return span;
        }

        if (existe === 0) {
            const insereLetraErr = document.querySelector('.tentativas .letra-erro');
            insereLetraErr.appendChild(spanLetraErrada(letra.toUpperCase()));
        }

        const letrasErradas = document.querySelectorAll('.tentativas .letra-erro span');

        const qtdErros = document.querySelector('.qtd-erros p span');
        qtdErros.innerHTML = letrasErradas.length;

        if (letrasErradas.length === 5) {
            setTimeout(() => {
                alert('Você perdeu!');
                location.reload();
            }, 1200)
        }

        if (parseInt(localStorage.getItem('ganhou')) == chave.length) {
            setTimeout(() => {
                alert('Parabéeennsss você venceu!');
                location.reload();
            }, 1200);
        }
    }
}