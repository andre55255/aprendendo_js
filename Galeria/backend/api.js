const db = require("./db");

function setCategoria() {
  return function (req, res) {
    if (req.body.categoria) {
      db.insert({ nome: req.body.categoria })
        .into("categorias")
        .then((_) =>
          res.send({
            sucesso: true,
            categoria: req.body.categoria,
          })
        )
        .catch((err) =>
          res.send({
            sucesso: false,
            erro: err,
          })
        );
    } else {
      res.send({ erro: "Categoria não informada" });
    }
  };
}

function getCategorias() {
  return function (req, res) {
    db.select("nome")
      .table("categorias")
      .then((data) => {
        const categorias = data.map((categoria) => {
          return categoria.nome;
        });
        res.send(categorias);
      })
      .catch((err) => res.send(err));
  };
}

function setImagensDB() {
  return function (req, res) {
    if (req.body.categoria) {
      db.select("id")
        .from("categorias")
        .where({ nome: req.body.categoria })
        .then((data) => {
          const idCategoria = data[0].id;
          db.insert({
            caminho: `./uploads/${req.file.originalname}`,
            id_categoria: idCategoria,
          })
            .table("imagens")
            .then((_) => {
              res.send({ sucesso: "Upload efetuado com sucesso!" });
            })
            .catch((err) => res.send({ erro: "Erro Status 505!" }));
        })
        .catch((_) =>
          res.send({
            erro: "Categoria não encontrada!",
          })
        );
    } else {
      res.send({
        erro: "Informe a categoria!",
      });
    }
  };
}

function getImagens() {
  return function (req, res) {
    db.select(["categorias.nome as categoria", "imagens.caminho as caminho"])
      .from("categorias")
      .innerJoin("imagens", "categorias.id", "imagens.id_categoria")
      .orderBy("categorias.nome", "asc")
      .then((data) =>
        res.send({
          imagens: data,
        })
      )
      .catch((erro) =>
        res.send({
          erro: erro,
        })
      );
  };
}
module.exports = { setCategoria, getCategorias, setImagensDB, getImagens };
