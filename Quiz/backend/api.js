const db = require('./db');

function setQuiz() {
    return function(req, res) {
        const quiz = {...req.body}
        if(quiz.nomeQuiz) {
            db.insert({nome: quiz.nomeQuiz})
                .into('quiz')
                .then(_ => res.send({ erro: false }))
                .catch(err => res.send({ erro: err }));
        }
    }
}

function getQuizes() {
    return function (req, res) {
        db.select(['nome'])
            .table('quiz')
            .orderBy('nome', 'asc')
            .then(quizes => res.send(quizes.map(quiz => {
                return quiz.nome;
            })))
            .catch(err => res.send({
                erro: err
            }));
    }
}

function setQuestoes() {
    return function (req, res) {
        async function transacao() {
            const dados = { ...req.body }

            const respostas = [{
                descricao: dados.resp1,
                correta: dados.certo1
            }, {
                descricao: dados.resp2,
                correta: dados.certo2
            }, {
                descricao: dados.resp3,
                correta: dados.certo3
            }, {
                descricao: dados.resp4,
                correta: dados.certo4
            }];

            try {
                await db.transaction(async trans => {
                    await trans.insert({descricao: dados.pergunta}).into('perguntas');
                    await trans.insert(respostas).into('respostas');
                    
                    const idQuiz = await trans.select('id').table('quiz').where({nome: dados.quiz});
                    const idPerg = await trans.select('id').table('perguntas').where({descricao: dados.pergunta});
                    const idRes1 = await trans.select('id').table('respostas').where({descricao: dados.resp1});
                    const idRes2 = await trans.select('id').table('respostas').where({descricao: dados.resp2});
                    const idRes3 = await trans.select('id').table('respostas').where({descricao: dados.resp3});
                    const idRes4 = await trans.select('id').table('respostas').where({descricao: dados.resp4});

                    await trans.insert({ id_quiz: idQuiz[0].id, id_respostas: idRes1[0].id, id_perguntas: idPerg[0].id }).into('perguntas_respostas');
                    await trans.insert({ id_quiz: idQuiz[0].id, id_respostas: idRes2[0].id, id_perguntas: idPerg[0].id }).into('perguntas_respostas');
                    await trans.insert({ id_quiz: idQuiz[0].id, id_respostas: idRes3[0].id, id_perguntas: idPerg[0].id }).into('perguntas_respostas');
                    await trans.insert({ id_quiz: idQuiz[0].id, id_respostas: idRes4[0].id, id_perguntas: idPerg[0].id }).into('perguntas_respostas');

                    res.send({erro: false});
                });
            } catch (err) {
                console.log(err);
                res.send({erro: err});
            }
        }

        transacao();
    }
}

function updateQuiz() {
    return function (req, res) {
        const quiz = { ...req.body }
        if (quiz) {
            db.update({ nome: quiz.atual })
                .table('quiz')
                .where({ nome: quiz.antigo })
                .then(_ => res.send({erro: false}))
                .catch(erro => res.send({erro}));
        }
    }
}

function deleteQuiz() {
    return function (req, res) {
        const quiz = req.body.quiz;
        if (quiz) {
            db.table('quiz')
                .where({ nome: quiz })
                .delete()
                .then(_ => res.send({ erro: false }))
                .catch(erro => {
                    console.log(erro.constraint);
                    res.send({
                        erro: erro.constraint,
                    });
                } );
        }
    }
}

function getPergQuiz() {
    return function(req, res) {
        const quiz = req.query.quiz;
        if (quiz) {
            db.transaction(async trans => {
                try {
                    const idQuiz = await trans.select('id').table('quiz').where({ nome: quiz });
                    const perguntas = await trans.select(['perguntas.descricao'])
                                .table('perguntas')
                                .innerJoin('perguntas_respostas', 'perguntas_respostas.id_perguntas', 'perguntas.id')
                                .where({ id_quiz: idQuiz[0].id });
    
                    let pergSet = new Set();
                    perguntas.forEach(pergunta => {
                        pergSet.add(pergunta.descricao);
                    });
    
                    const perg = Array.from(pergSet);
    
                    res.send({
                        quiz: quiz,
                        perguntas: perg
                    });
                } catch(err) {
                    res.send(err);
                }
            });
        }
    }
}

function deleteQuestao() {
    return function(req, res) {
        const dados = {...req.body}
        if (dados) {
            db.transaction(async trans => {
                try {
                    const idPerg = await trans.select('id')
                                            .table('perguntas')
                                            .where({descricao: dados.pergunta});
    
                    const idQuiz = await trans.select('id')
                                            .table('quiz')
                                            .where({nome: dados.quiz})

                    const idResp = await trans.select('id_respostas as id')
                                            .table('perguntas_respostas')
                                            .where({ id_perguntas: idPerg[0].id, id_quiz: idQuiz[0].id });
                    
                    await trans.where({id_perguntas: idPerg[0].id, id_quiz: idQuiz[0].id})
                                .table('perguntas_respostas')
                                .delete();

                    await trans.where({id: idPerg[0].id})
                                .table('perguntas')
                                .delete();

                    await trans.raw(`DELETE FROM respostas WHERE id BETWEEN ${idResp[0].id} and ${idResp[3].id}`);
    
                    res.send({erro: false});
                } catch(err) {
                    res.send(err);
                }
            });
        }
    }
}

function getPerguntaResp() {
    return function(req, res) {
        const dados = req.query;
        if (dados) {
            db.transaction(async trans => {
                try {
                    const idPerg = await trans.select('id')
                                            .table('perguntas')
                                            .where({descricao: dados.pergunta});

                    const idQuiz = await trans.select('id')
                                            .table('quiz')
                                            .where({nome: dados.quiz});

                    const respostas = await trans.select(['respostas.descricao', 'respostas.correta'])
                                                .table('respostas')
                                                .innerJoin('perguntas_respostas', 'perguntas_respostas. id_respostas', 'respostas.id')
                                                .where({id_quiz: idQuiz[0].id,id_perguntas: idPerg[0].id});
                    
                    const selecao = {
                        quiz: dados.quiz,
                        pergunta: dados.pergunta,
                        respostas: respostas
                    }

                    res.send(selecao);
                } catch (err) {
                    res.send(err);
                }
            });
        }
    }
}

function updateQuestao() {
    return function(req, res) {
        const dados = {...req.body}
        if(dados) {
            const respostas = [{
                descricao: dados.resp1,
                correta: dados.certo1
            }, {
                descricao: dados.resp2,
                correta: dados.certo2
            }, {
                descricao: dados.resp3,
                correta: dados.certo3
            }, {
                descricao: dados.resp4,
                correta: dados.certo4
            }];

            db.transaction(async trans => {
                try {
                    const idPerg = await trans.select('id')
                                            .table('perguntas')
                                            .where({descricao: dados.pergAnt});

                    const idResps = await trans.select('id_respostas as id')
                                            .table('perguntas_respostas')
                                            .where({id_perguntas: idPerg[0].id});
    
                    await trans.update({descricao: dados.pergunta})
                            .table('perguntas')
                            .where({id: idPerg[0].id});
    
                    await trans.update(respostas[0])
                            .table('respostas')
                            .where({id: idResps[0].id});
    
                    await trans.update(respostas[1])
                            .table('respostas')
                            .where({id: idResps[1].id});
    
                    await trans.update(respostas[2])
                            .table('respostas')
                            .where({id: idResps[2].id});
                            
                    await trans.update(respostas[3])
                            .table('respostas')
                            .where({id: idResps[3].id});
    
                    res.send("Alterado com sucesso!");
                } catch(err) {
                    console.log(err);
                    res.send(err);
                }
            });
        }
    }
}

function getJogo() {
    return function(req, res) {
        const quiz = req.query.quiz;

        if (quiz) {
            db.transaction(async trans => {
                try {
                    const idQuiz = await trans.select('id')
                                        .table('quiz')
                                        .where({nome: quiz});
                    
                    const questoes = await trans.select(['perguntas.descricao as pergunta', 'respostas.descricao as resposta', 'respostas.correta as correta'])
                                        .table('perguntas')
                                        .innerJoin('perguntas_respostas', 'perguntas_respostas.id_perguntas', 'perguntas.id')
                                        .innerJoin('respostas', 'perguntas_respostas.id_respostas', 'respostas.id')
                                        .where({id_quiz: idQuiz[0].id})
                                        .orderBy('pergunta', 'asc');
                    
                    const resp = {
                        quiz: quiz,
                        questoes: questoes
                    }
    
                    res.send(resp);
                } catch(err) {
                    res.send(err);
                }
            });
        }
    }
}

module.exports = { setQuiz, getQuizes, setQuestoes, updateQuiz, deleteQuiz, getPergQuiz, deleteQuestao,
    getPerguntaResp, updateQuestao, getJogo }