let listaDenuncias = [];
let listaFeedbacks = [];

const loadDenuncias = async () => {
    const table =  document.querySelector('#table');
    table.innerHTML = '';
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = `
        <tr>
            <th scope="col">Data</th>
            <th scope="col">Título</th>
            <th scope="col">Tipo</th>
            <th scope="col">Urgência</th>
            <th scope="col">Descrição</th>
            <th scope="col">Feedback</th>
            <th scope="col"></th>
            <th scope="col">Imagem</th>
            <th scope="col"></th>
        </tr>
    `;
    tableHead.setAttribute('style', 'border-top-color: aliceblue;');
    const tableBody = document.createElement('tbody');
    tableBody.setAttribute('class', 'table-group-divider');
    tableBody.setAttribute('style', 'border-top-color: aliceblue;');
    const response = await fetch('http://localhost:8080/api/cidadao/denuncia', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },

    });
    listaDenuncias = await response.json();
    let denuncias = '';
    for (denuncia of listaDenuncias) {  
        denuncias += `
                <tr>
                    <td>${new Date(denuncia.data).toLocaleDateString('pt-BR')}</td>
                    <td>${denuncia.titulo}</td>
                    <td>${denuncia.tipo.nome}</td>
                    <td>${denuncia.urgencia}</td> 
                    <td>${denuncia.texto}</td>
                    <td name="feedback" id="feedback${denuncia.id}">Feedback ainda não fornecido</td>
                    <td></td>
                    <td id="imagem${denuncia.id}">Sem imagem</td>
                    <td><button class="btn btn-danger rounded-pill pb-1 pt-1" onclick="confirmarExclusao(${denuncia.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                  </svg></button></td>
                </tr>
                `                
    }
    tableBody.innerHTML = denuncias;
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    const divButton = criarElemento('div', {class: 'container', style: 'display: flex; justify-content: center; gap: 3px;'});
    const voltar = criarBotao('button', 'Voltar', '#', 'btn btn-primary rounded-pill pt-2 pb-2');
    voltar.addEventListener('click', () => window.location.reload());
    voltar.setAttribute('style', 'margin-top: 5px');
    divButton.appendChild(voltar);
    document.querySelector('#buttonSection').appendChild(divButton);
    await loadImagem();
    await loadFeedback();
}

const loadFeedback = async () => {
    listaFeedbacks = await fetch('http://localhost:8080/api/admin/denuncia/feedbacks', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    }).then(res => {
        if(res.ok)
            return res.json();
    })
    for (let denuncia of listaDenuncias){
        const feedback = listaFeedbacks.find(feed => feed.denuncia.id === denuncia.id);
        if(feedback) {
            const idTag = 'feedback'+denuncia.id;
            document.querySelector('#'+idTag).innerHTML = feedback.texto;
        }
        const idButton = 'button'+denuncia.id;
        document.querySelector('#'+idButton).addEventListener('click', () => montaFeedbackForm(denuncia.id));
    }
}

const loadImagem = async () => {
    for (let item of listaDenuncias) {
        const res = await fetch('http://localhost:8080/api/cidadao/denuncia/imagem?id='+item.id, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        });
        if(res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const button = document.createElement('button');
            button.setAttribute('class','btn btn-secondary rounded-pill pt-1 pb-1');
            button.textContent = 'Visualizar';
            button.onclick = () => {
                window.open(url, '_blank');
            };
            const tagId = 'imagem'+item.id;
            document.querySelector('#'+tagId).innerHTML = '';
            document.querySelector('#'+tagId).appendChild(button);
        }
    }
}

const confirmarExclusao = async (id) => {
    if(confirm('Tem certeza que deseja remover sua denúncia?')) {
        await excluirDenuncia(id);
    }
}

const excluirDenuncia = async (id) => {
    const res = await fetch('http://localhost:8080/api/cidadao/denuncia?id='+id, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        });
    if (res.ok) {
        alert('Denúncia removida.');
        preparaTabela();
        loadDenuncias();
    }
    else {
        const message = res.body();
        alert('Erro ao remover: ', message);
    }
        
}