function getProds() {
    $.ajax({
        url: "http://localhost:3001/produtos",
        method: "get",
        success: function(data) {
            excluirBtn('#getProd');
            const res = document.getElementById('tabela');
            res.appendChild(criarTabela(data.prods));
        }
    })


}

function excluirBtn(id) {
    $(id).remove();
}

function criarTabela(produtos) {
    const tabela = document.createElement('table');

    const thead = document.createElement('thead');
    const trow = document.createElement('tr');

    const thId = document.createElement('th');
    thId.innerHTML = "ID";

    const thNome = document.createElement('th');
    thNome.innerHTML = "Nome";

    const thPreco = document.createElement('th');
    thPreco.innerHTML = "Preço";

    // const thAcoes = document.createElement('th')
    // thAcoes.innerHTML = "Açoes";

    trow.appendChild(thId);
    trow.appendChild(thNome);
    trow.appendChild(thPreco);
    // trow.appendChild(thAcoes);

    thead.appendChild(trow);

    tabela.appendChild(thead);

    const linhas = produtos.map((produto, index) => {
        const tr = document.createElement('tr');

        const tId = document.createElement('td');
        tId.innerHTML = produto.id;

        const tNome = document.createElement('td');
        tNome.innerHTML = produto.nome;

        const tPreco = document.createElement('td');
        tPreco.innerHTML = parseFloat(produto.preco_unit).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        
        /* Botoes de acao */
        // const icoEdit = document.createElement('i');
        // icoEdit.classList.add('material-icons');
        // icoEdit.innerHTML = "edit";
    
        // const icoDel = document.createElement('i');
        // icoDel.classList.add('material-icons');
        // icoDel.innerHTML = "delete";

        // const alterar = document.createElement('a');
        // alterar.setAttribute("href", "");
        // alterar.setAttribute("jsLink", "#/pages/alterar.html");
        // alterar.classList.add("alterar");
        // alterar.appendChild(icoEdit);

        // const deletar = document.createElement('a');
        // // deletar.setAttribute("href", "");
        // // deletar.setAttribute("jsLink", "#/pages/deletar.html");
        // deletar.classList.add("deletar");
        // deletar.appendChild(icoDel);

        // const tdAcoes = document.createElement('td');
        // // tdAcoes.appendChild(alterar);
        // tdAcoes.appendChild(deletar);

        tr.appendChild(tId);
        tr.appendChild(tNome);
        tr.appendChild(tPreco);
        // tr.appendChild(tdAcoes);

        return tr;
    });


    const tbody = document.createElement('tbody');
    
    linhas.forEach(linha => {
        tbody.appendChild(linha);
    });

    const trFoot = document.createElement('tr');
    trFoot.style.backgroundColor = "#999";
    trFoot.style.fontWeight = "bold";
    const tdFoot = document.createElement('td');
    tdFoot.setAttribute("colspan", "2");
    tdFoot.innerHTML = "Valor Total";
    trFoot.appendChild(tdFoot);

    const total = produtos.reduce(function (soma, atual) {
        console.log(soma, atual.preco_unit);
        return soma + parseFloat(atual.preco_unit);
    }, 0);

    const tdTotal = document.createElement('td');
    tdTotal.innerHTML = total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    trFoot.appendChild(tdTotal);

    tabela.appendChild(tbody);
    tabela.appendChild(trFoot);
    tabela.classList.add('striped');

    return tabela;
}