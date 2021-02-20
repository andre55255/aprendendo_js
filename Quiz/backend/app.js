const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const api = require('./api');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/quiz')
    .post(api.setQuiz())
    .get(api.getQuizes())
    .put(api.updateQuiz())
    .delete(api.deleteQuiz());

app.route('/questoes')
    .post(api.setQuestoes())
    .delete(api.deleteQuestao())
    .get(api.getPerguntaResp())
    .patch(api.updateQuestao());

app.route('/gerenciarPerguntas')
    .get(api.getPergQuiz());

app.route('/jogar')
    .get(api.getJogo());

app.listen(3000, () => console.log('Servidor rodando!'));