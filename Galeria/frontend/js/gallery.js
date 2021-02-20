function criarOption(categoria) {
    const opt = document.createElement("option");
    opt.setAttribute("value", categoria);
    opt.innerHTML = categoria;
    return opt;
  }

function carregarMenu() {
    const menu = document.querySelector('#categoriaImage');

    if (menu !== null) {
        if (menu.childElementCount == 0) {
            $.ajax({
                url: "http://localhost:3003/categorias",
                method: "get",
                success: function(data) {
                    if (data.length) {
                        data.forEach(categoria => {
                            menu.appendChild(criarOption(categoria));
                        });
                    } else {
                        menu.remove();
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    }
    carregarImg();
}

function criarImg(src) {
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.style.width = "200px";
    img.style.borderRadius = "15px";
    img.style.margin = "12px";
    img.classList.add('img-fluid', 'mb-4');

    return img;
}

function imagensPorCategoria(container, select, imgs) {

    select.addEventListener("change", function(e) {
        const categoriaSelecionada =  this.options[this.selectedIndex].value;

        for (child of container.children) {
            child.remove();
        }
        
        console.log(imgs);

        imgs.forEach(img => {
            if (categoriaSelecionada == img.categoria) {
                container.appendChild(criarImg(img.caminho));
            }
        });
    });
}

function carregarImg() {
    const containerImgs = document.querySelector('[js-destino-img]');
    const select = document.querySelector('#categoriaImage');

    if (containerImgs !== null) {
        if (containerImgs.childElementCount == 0) {
            $.ajax({
                url: "http://localhost:3003/imagens",
                method: "get",
                success: function(data) {
                    imagensPorCategoria(containerImgs, select, data.imagens);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    }
}