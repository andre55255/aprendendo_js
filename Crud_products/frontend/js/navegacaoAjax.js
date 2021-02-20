(function () {
    function marcarLinkComoSelecionado(hash) {
        const links = document.querySelectorAll(`[jsLink]`);
        links.forEach(link => link.classList.remove('selecionado'));

        const link = document.querySelector(`[jsLink='${hash}']`);
        link.classList.add('selecionado');
    }

    function navegarViaAjax(hash) {
        if (!hash) return;

        const link = document.querySelector(`[jsLink='${hash}']`);
        const destino = document.querySelector('[jsDestino]');

        const url = hash.substring(1);
        fetch(url)
            .then(resp => resp.text())
            .then(html => {
                destino.innerHTML = html
                marcarLinkComoSelecionado(hash)
            });
    }

    function configurarLinks() {
        document.querySelectorAll('[JsLink]')
            .forEach(link => {
                link.href = link.attributes['jsLink'].value;
            })
    }

    function navegacaoInicial() {
        if (location.hash) {
            navegarViaAjax(location.hash);
        } else {
            const primeiroLink = document.querySelector('[jsLink]');
            navegarViaAjax(primeiroLink.hash);
        }
    }

    window.onhashchange = e => navegarViaAjax(location.hash);

    configurarLinks();
    navegacaoInicial();
})()