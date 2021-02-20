function geraImg(quadrante, turno) {
  const img = document.createElement("img");
  img.classList.add("image");
  img.setAttribute("src", `./img/${turno}.png`);
  if (!quadrante.firstChild) {
    quadrante.appendChild(img);
  }
}

function jogo() {
  let turno = "x";
  let jogadorX = [];
  let jogadorCirculo = [];

  const reiniciar = document.querySelector(["[js-reiniciar]"]);
  reiniciar.addEventListener("click", function (e) {
    location.reload();
  });

  let venceu = [
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],
    ["a1", "b2", "c3"],
    ["c1", "b2", "a3"],
  ];

  function arraysIguais(array1, array2) {
    array1.sort();
    array2.forEach((array) => {
      array.sort();
    });

    for (let i = 0; i < array2.length; i++) {
        let cont = 0;
      for (let j = 0; j < array1.length; j++) {
        if(array1[j] == array2[i][j]) {
            cont++;
        }
        if (array1[j] && cont == 3) {
          return true;
        }
      }
    }
    return false;
  }

  document.querySelectorAll("[js-quadrantes]").forEach((ele) => {
    ele.addEventListener("click", function (e) {
      const vitoria = document.querySelector("[js-venceu]");

      geraImg(e.target, turno);
      if (turno === "x") {
        jogadorX.push(e.target.getAttribute("id"));
        turno = "circulo";
      } else {
        jogadorCirculo.push(e.target.getAttribute("id"));
        turno = "x";
      }

      console.log(`X: ${jogadorX}\nC: ${jogadorCirculo}\n`);

      if (arraysIguais(jogadorX, venceu)) {
        vitoria.innerHTML = "O jogador X venceu!";
      } else if (arraysIguais(jogadorCirculo, venceu)) {
        vitoria.innerHTML = "O jogador Bola venceu";
      } else if (jogadorCirculo.length + jogadorX.length == 9) {
        vitoria.innerHTML = "Deu velha!";
      }
    });
  });
}

jogo();