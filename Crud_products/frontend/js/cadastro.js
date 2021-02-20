function cadastrar() {
  document.cadastroProd.onsubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const dados = new FormData(form);

    if (!(dados.get("nome") && dados.get("preco_unit"))) {
      M.toast({ html: "Gentileza Preencher os campos!" });
    }

    $.ajax({
      url: "http://localhost:3001/produtos",
      method: "post",
      enctype: "multipart/form-data",
      data: new URLSearchParams(dados),
      processData: false, // impedir que o jQuery tranforma a "data" em querystring
      contentType: false, // desabilitar o cabeçalho "Content-Type"
      cache: false, // desabilitar o "cache"
      success: function (data) {
        M.toast({
          html: `Produto ${data.produto.nome} cadastrado com sucesso!`,
        });
      },
      error: function (err) {
        M.toast({ html: err.erro || "Servidor sem serviço!" });
      },
    });
  };
};
