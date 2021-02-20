function carregarCategorias() {
  const select = document.querySelector("#categoriaImg");

  if (select !== null) {
    if (select.childElementCount === 1) {
      $.ajax({
        url: "http://localhost:3003/categorias",
        method: "get",
        success: function (data) {
          data.forEach((categoria) => {
            select.appendChild(criarOption(categoria));
          });
        },
        error: function (err) {
          emitirAlerta(err);
        },
      });
    }
  }
}

function criarOption(categoria) {
  const opt = document.createElement("option");
  opt.setAttribute("value", categoria);
  opt.innerHTML = categoria;
  return opt;
}

///////////////////////////////////////////////////////////////////////////////////

function emitirAlerta(msg, sucesso = false) {
  const div = document.createElement("div");
  div.classList.add("alert", "col-6", "offset-3");
  div.setAttribute("role", "alert");
  div.innerHTML = msg;

  if (sucesso) {
    div.classList.add("alert-success");
  } else {
    div.classList.add("alert-danger");
  }

  const alertSetado = document.querySelector('[jsDestino] > div[role="alert"]');
  const alertSet = document.querySelector("[jsDestino]");

  if (alertSetado != null) {
    alertSetado.remove();
  }

  alertSet.appendChild(div);
}

////////////////////////////////////////////////////////////////////////////////////

function extensaoImg(ext) {
    const extensoesValidas = [
        "image/png",
        "image/jpg",
        "image/jpeg"
    ]

    let valida = false;

    extensoesValidas.forEach(extensao => {
        if (extensao == ext) {
            valida = true;
        }
    });

    return valida;
}

function uploadImg(e) {
    e.preventDefault();

    const select = document.querySelector("#categoriaImg");
    const opt = document.querySelectorAll("#categoriaImg > option");
    
    const file = document.querySelector('input[name="loadImg"]');

    if (extensaoImg(file.files[0].type)) {

        if (opt[select.selectedIndex].value == 0) {
            emitirAlerta('Selecione uma categoria!');
        } else {
            const img = new FormData();
            
            img.set(file.name, file.files[0]);
            img.set('categoria', opt[select.selectedIndex].value)
            
            $.ajax({
                url: "http://localhost:3003/upload",
                method: "post",
                enctype: "multipart/form-data",
                data: img,
                processData: false,
                contentType: false,
                cache: false,
                success: function(resp) {
                  if(resp.sucesso) {
                    emitirAlerta(resp.sucesso, true);
                    const form = document.querySelector('form[name="add_img"]');
                    form.reset();
                  }
                },
                error: function(err) {
                  emitirAlerta(resp.erro);
                }
            });
        }
    } else {
        emitirAlerta('Extensão inválida, forneca uma imagem .png, .jpg, ou .jpeg');
    }

}