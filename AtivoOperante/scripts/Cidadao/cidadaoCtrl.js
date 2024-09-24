const loadTipos = async () => {
    await fetch('http://localhost:8080/api/cidadao/tipos', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    })
    .then(response => response.json())
    .then(data => {
        const select = document.querySelector('#tipoSelect');
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nome;
            select.appendChild(option);
        })
    })
    .catch(error => console.error('Erro ao obter tipos', error));
}

const loadOrgaos = async () => {
    
    await fetch('http://localhost:8080/api/cidadao/orgaos', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    })
    .then(response => response.json())
    .then(data => {
        const select = document.querySelector('#orgaoSelect');
        data.forEach(orgao => {
            const option = document.createElement('option');
            option.value = orgao.id;
            option.textContent = orgao.nome;
            select.appendChild(option);
        })
    })
    .catch(error => console.error('Erro ao obter tipos', error));
}
const sendDenuncia = async () => {
    document.querySelector('#mensagem').innerHTML = '';
    const titulo = document.querySelector('#titulo').value;
    const texto = document.querySelector('#descricao').value;
    const urgencia = parseInt(document.querySelector('#urgenciaSelect').value);
    const idTipo = parseInt(document.querySelector('#tipoSelect').value)
    const idOrgao = parseInt(document.querySelector('#orgaoSelect').value);
    const imagem = document.querySelector('input[type=file]').files[0];

    if(!titulo) {
        document.querySelector('#mensagem').innerHTML = 'Por favor informe um título';
    }
    else if(!texto) {
        document.querySelector('#mensagem').innerHTML = 'Por insira uma descrição';
    }
    else {
        const data = new FormData();
        data.append('titulo', titulo);
        data.append('texto', texto);
        data.append('urgencia', urgencia);
        data.append('idTipo', idTipo);
        data.append('idOrgao', idOrgao);
        if(imagem)
            data.append('imagem', imagem);
        document.querySelector('#mensagem').innerHTML = 'Confirma os dados informados?';
        const button = document.querySelector('#botao1');
        button.innerHTML = 'Confirmar <i class="fas fa-paper-plane"></i>';
        button.removeAttribute('class');
        button.setAttribute('class','btn btn-success rounded-pill pt-2 pb-2');
        const cancelar = document.querySelector('#botao2');
        cancelar.innerHTML = 'Cancelar';
        cancelar.removeAttribute('class');
        cancelar.setAttribute('class','btn btn-danger rounded-pill pt-2 pb-2');
        cancelar.removeEventListener('click', () => cidadaoHome());
        cancelar.addEventListener('click', () => denunciaForm(data));
        button.removeEventListener('click', () => sendDenuncia());
        button.addEventListener('click', () => confirmaDenuncia(data));     
    }
}

const confirmaDenuncia = async (data) => {
    await fetch('http://localhost:8080/api/cidadao/denuncia', {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
        body: data,
    }).then(response => {
        if(response.ok) {
            alert('Denúncia enviada!');
            denunciaForm();
        }
        else
            console.error('Falha no envio: '+ response.status);
    }).catch(error => {
        console.error('Erro ao enviar denúncia: ', error);
    });
}

const validaSessaoCidadao = async () => {
    await fetch('http://localhost:8080/access/session', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        }
    }).then(response => {
        if(response.ok && parseInt(localStorage.getItem('access')) === 2)
            cidadaoHome();
        else {
            alert("Entre como cidadão para continuar!");
            localStorage.removeItem('access');
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        }
    });
} 