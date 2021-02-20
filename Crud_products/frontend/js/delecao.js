function deletar() {
  document.deleteProd.onsubmit = (e) => {
    e.preventDefault();

    if (confirm("Deseja excluir o registro?")) {
      const id = document.querySelector("[js-id]").value;

      $.ajax({
        url: "http://localhost:3001/produtoId/:id",
        method: "delete",
        data: {
          id: id,
        },
        success: function (_) {
          M.toast({ html: `Produto excluído com sucesso!` });
        },
        error: function (err) {
          M.toast({ html: `Ocorreu um erro!` });
        },
      });
    }
  };
}

function getProdId() {
  const id = document.querySelector("[js-id]").value;

  $.ajax({
    url: "http://localhost:3001/produtoId/:id",
    method: "get",
    data: {
      id: id,
    },
    success: function (data) {
      const produto = data.prods[0];

      const nome = document.querySelector("[js-nome]");
      nome.value = produto.nome;

      const preco = document.querySelector("[js-preco]");
      preco.value = produto.preco_unit;

      document.querySelector("[js-btn-del]").removeAttribute("disabled");
    },
    error: function (err) {
      M.toast({ html: "Ocorreu um erro!" });
    },
  });
}
