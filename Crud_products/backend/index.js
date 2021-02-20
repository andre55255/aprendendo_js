const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { salvar, getProdutos, alterar, deletar, getProdNome, getProdId } = require('./middleProd');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.route('/produtos')
    .post(salvar())
    .get(getProdutos())
    .put(alterar())
    
    app.route('/produto/:nome')
    .get(getProdNome());
    
    app.route('/produtoId/:id')
    .delete(deletar())
    .get(getProdId());
    
app.listen(3001, () => console.log('Server runing . . .'));