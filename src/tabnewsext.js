var tabnewsext = [];

addFavoritosMenu();
addFavoritosBadge();
validarArticles();
//validarPost();

document.addEventListener("DOMSubtreeModified", function () {
    addFavoritosMenu();
    addFavoritosBadge();
    validarArticles();
    //validarPost();
});

function addFavoritosMenu() {
    if (document.querySelector('div[class*=tabnewsext_favMenu]') != null)
        return;

    if (document.querySelector('div[class*=HeaderItem]:nth-child(3)') == null)
        return;

    if (tabnewsext['favMenu'])
        return;

    tabnewsext['favMenu'] = true;

    let headerItem = document.querySelector('div[class*=HeaderItem]:nth-child(3)').cloneNode(true);

    document.querySelector('div[class*=HeaderItem]:nth-child(3)').classList.remove('bqrDZM');
    document.querySelector('div[class*=HeaderItem]:nth-child(3)').classList.add('jTwoLh');

    headerItem.querySelector('a').classList.remove('omJCm');
    headerItem.querySelector('a').classList.add('hIZhUi');

    headerItem.classList.add('tabnewsext_favMenu');
    headerItem.getElementsByTagName('a')[0].innerText = "Favoritos";
    headerItem.getElementsByTagName('a')[0].href = "#";
    headerItem.getElementsByTagName('a')[0].addEventListener('click', () => { carregarTabsFavoritos() });

    document.querySelector('div[class*=HeaderItem]:nth-child(3)').parentNode.insertBefore(headerItem, document.querySelector('div[class*=HeaderItem]:nth-child(3)').nextSibling);

    tabnewsext['favMenu'] = null;
}

function addFavoritosBadge() {
    if (document.querySelector('div[class*=tabnewsext_favBadge]') != null)
        return;

    if (document.querySelector('div[class*=HeaderItem]:nth-child(5)') == null)
        return;

    if (tabnewsext['favHeader'])
        return;

    tabnewsext['favHeader'] = true;

    chrome.storage.local.get().then((items) => {
        var allKeys = Object.keys(items);

        let headerItem = document.querySelector('div[class*=HeaderItem]:nth-child(5)').cloneNode(true);
        headerItem.classList.add('tabnewsext_favBadge');
        headerItem.getElementsByTagName('span')[0].attributes['aria-label'].value = "Favoritos";
        headerItem.getElementsByTagName('svg')[0].attributes['fill'].value = '#E5BA0F';
        headerItem.querySelector('span span').innerText = allKeys.length;

        document.querySelector('div[class*=HeaderItem]:nth-child(5)').parentNode.insertBefore(headerItem, document.querySelector('div[class*=HeaderItem]:nth-child(5)'));

        tabnewsext['favHeader'] = null;
    });
}

function validarArticles() {
    if (document.querySelector('article') == null)
        return;

    for (var art of [...document.querySelectorAll('article')]) {
        validarArticle(art);
    }
}

function validarArticle(article) {
    if (article == null)
        return;

    if (article.querySelector('div[class*=tabnewsext_fav_on]') != null)
        return;

    if (article.querySelector('div[class*=tabnewsext_fav_off]') != null)
        return;

    let url = article.querySelector('a')['href'];

    if (tabnewsext[url])
        return;

    tabnewsext[url] = true;

    let fav = false;

    chrome.storage.local.get(url).then((result) => {
        if (result[url] != undefined)
            fav = true;

        let div = document.createElement('div');
        div.classList.add('tabnewsext_fav_' + (fav ? 'on' : 'off'));

        div.addEventListener('click', toggleFav, false);

        article.insertBefore(div, article.firstChild);

        tabnewsext[url] = null;
    });
}

function validarPost() {
    if (document.querySelector('h1[class^=Heading]') == null)
        return;
}

function toggleFav() {
    let article = this.parentNode;
    let fav = this.classList[0] != 'tabnewsext_fav_on';
    let url = article.querySelector('a')['href'];

    if (fav) {
        chrome.storage.local.set({ [url]: true }).then(() => {
            let newClass = this.classList[0].replace('off', 'on');
            this.classList.remove(this.classList[0]);
            this.classList.add(newClass);

            document.querySelector('.tabnewsext_favBadge span span').innerText = parseInt(document.querySelector('.tabnewsext_favBadge span span').innerText) + 1;
        });
    }
    else {
        chrome.storage.local.remove(url).then(() => {
            let newClass = this.classList[0].replace('on', 'off');
            this.classList.remove(this.classList[0]);
            this.classList.add(newClass);

            document.querySelector('.tabnewsext_favBadge span span').innerText = parseInt(document.querySelector('.tabnewsext_favBadge span span').innerText) - 1;
        });
    }
}

function carregarTabsFavoritos() {
    if (tabnewsext['favConteudo'])
        return;

    tabnewsext['favConteudo'] = true;

    let divConteudo = document.querySelector('div.kraPei');

    while (divConteudo.hasChildNodes())
        divConteudo.removeChild(divConteudo.firstChild);

    chrome.storage.local.get().then((items) => {
        var allKeys = Object.keys(items);

        if (allKeys.length == 0)
            return;

        let mainDiv = document.createElement('div');
        mainDiv.classList.add('Box-sc-1gh2r6s-0', 'hyGYav');

        divConteudo.appendChild(mainDiv);

        for (var i = 0; i < allKeys.length; i++) {
            let url = allKeys[i];
            let urlApi = url.replace('tabnews.com.br/', 'tabnews.com.br/api/v1/contents/');

            let divNumeracao = document.createElement('div');
            divNumeracao.classList.add('Box-sc-1gh2r6s-0', 'iHkTFo');
            let spanNumeracao = document.createElement('span');
            spanNumeracao.classList.add('Text-sc-125xb1i-0', 'fHcGEk');
            spanNumeracao.innerText = (i + 1) + '.';

            divNumeracao.appendChild(spanNumeracao);
            mainDiv.appendChild(divNumeracao);

            let article = document.createElement('article');
            article.classList.add('Box-sc-1gh2r6s-0', 'frovG');

            let divLink = document.createElement('div');
            divLink.classList.add('Box-sc-1gh2r6s-0', 'eOokvn');
            let a = document.createElement('a');
            a.classList.add('Link-sc-hrxz1n-0', 'bPBLTS');
            a.attributes['sx'] = '[object Object]';
            a.href = url;
            a.innerText = url;

            divLink.appendChild(a);
            article.appendChild(divLink);

            let divDados = document.createElement('div');
            divDados.classList.add('Box-sc-1gh2r6s-0', 'bnKvGs');

            let spanTabCoins = document.createElement('span');
            spanTabCoins.classList.add('Text-sc-125xb1i-0', 'givBnZ');
            spanTabCoins.innerText = '0 tabcoins';
            divDados.appendChild(spanTabCoins);
            divDados.append(document.createTextNode(' \u00B7 '));

            let spanComentarios = document.createElement('span');
            spanComentarios.classList.add('Text-sc-125xb1i-0', 'givBnZ');
            spanComentarios.innerText = '0 comentários';
            divDados.appendChild(spanComentarios);
            divDados.append(document.createTextNode(' \u00B7 '));

            let usuario = /tabnews.com.br\/([^\/]+)/g.exec(url)[1];

            let linkUsuario = document.createElement('a');
            linkUsuario.classList.add('Link-sc-hrxz1n-0', 'czRdDB');
            linkUsuario.attributes['sx'] = '[object Object]';
            linkUsuario.href = 'https://www.tabnews.com.br/' + usuario;
            linkUsuario.innerText = usuario;
            divDados.appendChild(linkUsuario);
            divDados.append(document.createTextNode(' \u00B7 '));

            let spanDataHora = document.createElement('span');
            spanDataHora.classList.add('Text-sc-125xb1i-0', 'givBnZ');
            spanDataHora.innerText = '0 dias atrás';
            divDados.appendChild(spanDataHora);

            article.appendChild(divDados);
            mainDiv.appendChild(article);
        }

        tabnewsext['favConteudo'] = null;
    });
}