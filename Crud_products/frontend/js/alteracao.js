function alterar() {
  document.alterarProd.onsubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const dados = new FormData(form);

    const jsId = document.querySelector("[js-id]").value;
    dados.set("id", jsId);

    $.ajax({
      url: "http://localhost:3001/produtos",
      method: "put",
      enctype: "multipart/form-data",
      data: new URLSearchParams(dados),
      processData: false, // impedir que o jQuery tranforma a "data" em querystring
      contentType: false, // desabilitar o cabeçalho "Content-Type"
      cache: false, // desabilitar o "cache"
      success: function (data) {
        M.toast({ html: `Produto alterado com sucesso!` });
      },
      error: function (err) {
        M.toast({ html: err.erro || "Servidor sem serviço!" });
      },
    });
  };
}

/* Pega a prévia do produto a ser alterado*/
function getProdNome() {
  const nome = document.querySelector("[js-nome]").value;

  $.ajax({
    url: "http://localhost:3001/produto/:nome",
    method: "get",
    data: {
      nome: nome,
    },
    success: function (data) {
      const produto = data.prods[0];

      const id = document.querySelector("[js-id]");
      id.value = produto.id;

      const preco = document.querySelector("[js-preco]");
      preco.value = produto.preco_unit;

      const btnAlterar = document.querySelector("[js-btn-alterar]");
      btnAlterar.removeAttribute("disabled");
    },
    error: function (err) {
      M.toast({ html: `Produto não encontrado!` });
    },
  });
}
