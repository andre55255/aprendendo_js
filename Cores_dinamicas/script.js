const btnGerar = document.querySelector('[js-btn-gerar]');

btnGerar.addEventListener("click", function(e) {
    const div = document.createElement('div');
    div.classList.add('box');
    
    document.querySelector('.cores').append(div);

    document.querySelectorAll(".cores > div").forEach(e => {
        e.addEventListener("mouseover", function() {
            function getRandomColor() {
                let letters = "0123456789ABCDEF";
                let color = "#";
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            } 
            e.style.backgroundColor = getRandomColor();
        })
    })
});

const btnDel = document.querySelector('[js-btn-deletar]');

btnDel.addEventListener("click", function(e) {
    const div = document.querySelector('.box');
    div.remove();
});
