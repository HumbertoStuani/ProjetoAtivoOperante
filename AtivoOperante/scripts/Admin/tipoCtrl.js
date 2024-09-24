let listaTipos = [];

const loadTipos = async () => {
    const table = document.querySelector('#table');
    table.innerHTML = '';
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = `
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Tipos de Problemas</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
    `;
    tableHead.setAttribute('style', 'border-top-color: aliceblue;');
    const tableBody = document.createElement('tbody');
    tableBody.setAttribute('class', 'table-group-divider');
    tableBody.setAttribute('style', 'border-top-color: aliceblue;');
    const response = await fetch('http://localhost:8080/api/admin/tipo/all', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    });
    listaTipos = await response.json();
    let tipos = "";
    for(tipo of listaTipos) {
        let itemTipo = `
            <tr>
                <td>${tipo.id}</td>
                <td id="${tipo.id}">${tipo.nome}</td>
                <td><button class="btn btn-primary rounded-pill pt-1 pb-1" onclick="montaTipoForm(${tipo.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
              </svg></td>
                <td><button class="btn btn-danger rounded-pill pt-1 pb-1" onclick="deleteTipo(${tipo.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
              </svg></td>
            </tr>
        `;
        tipos += itemTipo;
    };
    tableBody.innerHTML = tipos;
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    
    const divButton = criarElemento('div', {class: 'container', style: 'display: flex; justify-content: center; gap: 3px;'});
    const novo = criarBotao('button', 'Adicionar novo', '#', 'btn btn-primary rounded-pill pt-2 pb-2');
    novo.addEventListener('click', () => montaTipoForm());
    novo.setAttribute('style', 'margin-top: 5px');
    const voltar = criarBotao('button', 'Voltar', '#', 'btn btn-primary rounded-pill pt-2 pb-2');
    voltar.addEventListener('click', () => window.location.reload());
    voltar.setAttribute('style', 'margin-top: 5px');
    divButton.appendChild(novo);
    divButton.appendChild(voltar);
    document.querySelector('#buttonSection').appendChild(divButton);
}

const deleteTipo = async (id) => {
    await fetch('http://localhost:8080/api/admin/tipo?id='+id, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
    }).then(res => {
        if(res.ok) {
            alert('Tipo excluído.');
            tipoControl();
        }
    }).catch(err => console.error('Erro ao excluir tipo, ', err));
}

const montaTipoForm = async (id) => {
    const formSection = document.querySelector('#formSection');
    formSection.innerHTML = '';
    const form = criarElemento('form',{ id: 'tipoForm' });
    const div = criarElemento('div', { class: 'input-group mb-3', style: 'display: flex; justify-content: center;' });
    const span = criarElemento('span', { class: 'input-group-text', id: 'inputGroup-sizing-default' }, 'Nome');
    const input = criarInput('text', '', 'tipoNome');
    div.appendChild(span);
    div.appendChild(input);
    const button = criarBotao('submit', 'Enviar','#', 'btn btn-primary rounded-pill pt-1 pb-1');
    button.setAttribute('style', 'margin-left: 5px');
    if(id) {
        input.value = listaTipos.find(tipo => tipo.id === id).nome;
    }
    div.appendChild(button);
    form.appendChild(div);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await enviaTipo(id);
    });
    formSection.appendChild(form);
}

const enviaTipo = async (id) => {
    const nome = document.querySelector('#tipoNome').value;
    if(nome.trim() !== "") {
        document.querySelector('#mensagem').textContent = '';
        const novoTipo = { nome: nome };
        if(id) {
            await fetch('http://localhost:8080/api/admin/tipo?id='+id, {
                method: 'PATCH',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoTipo),
            }).then(res => {
                if(res.ok) {
                    alert('Tipo alterado');
                    tipoControl();
                }
            }).catch(err => console.error('Erro ao atualizar tipo, ', err));
            
        }
        else {
            await fetch('http://localhost:8080/api/admin/tipo', {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoTipo),
            }).then(res => {
                if(res.ok) {
                    alert('Tipo adicionado');
                    tipoControl();
                }
            }).catch(err => console.error('Erro ao cadastrar tipo, ', err));
            
        }
    }
    else
        document.querySelector('#mensagem').textContent = 'Por favor insira um nome.';
}

const tipoControl = async () => {
    document.querySelector('#formSection').innerHTML='';
    document.querySelector('#buttonSection').innerHTML = '';
    await loadTipos();

}