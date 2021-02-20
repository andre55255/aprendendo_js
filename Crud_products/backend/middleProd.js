const db = require('./db');

function salvar() {
    return function(req, res) {
        const produto = { ...req.body };
        if(produto.nome && produto.preco_unit){
            db.insert(produto)
                .into('produtos')
                .then(prod => res.send({
                    sucesso: true,
                    produto: produto
                }))
                .catch(err => res.send({erro: "Ocorreu um erro!"}));
        } else {
            res.send({erro: "Dados incompletos!"});
        }
    }
}

function getProdutos() {
    return function(req, res) {
        db('produtos')
           .select(['nome', 'id', 'preco_unit'])
           .orderBy('nome', 'asc')
           .then(prods => res.send({
               prods: prods,
               status: 204
           }))
           .catch(err => res.send({ erro: "Ocorreu um erro!" }));
    }
}

function alterar() {
    return function(req, res) {
        const prod = { ...req.body };
        if(prod.id) {
            db.update(prod)
               .table('produtos')
               .where({id: prod.id})
               .then(data => res.send({
                   prods: data
               }))
               .catch(err => res.send({ erro: err }));
        } else {
            res.send({ erro: "Produto não encontrado!" });
        }
    }
}

function deletar() {
    return function(req, res) {
        if(req.body.id) {
            db.table('produtos')
              .where({ id: req.body.id })
              .delete()
              .then(_ => res.send())
              .catch(err => res.send(err));
        } else {
            res.send("Produto não cadastrado!")
        }
    }
}

function getProdNome() {
    return function(req, res) {
        const nome = req.query.nome;
        if (nome) {
            db('produtos')
                .select(['id', 'nome', 'preco_unit'])
                .where({ nome: nome })
                .then(data => res.send({
                    prods: data
                }))
                .catch(err => res.send({
                    erro: "Ocorreu um erro!" + err
                }));
        } else {
            res.send({
                erro: "Dados não informados!"
            })
        }
    }
}

function getProdId() {
    return function(req, res) {
        const id = req.query.id;
        if(id) {
            db('produtos')
                .select(['id', 'nome', 'preco_unit'])
                .where({ id: id })
                .then(data => res.send({ prods: data }))
                .catch(erro => res.send({erro}))
        } else {
            res.send({
                erro: "Dados não informados!"
            })
        }
    }
}

module.exports = { salvar, getProdutos, alterar, deletar, getProdNome, getProdId };