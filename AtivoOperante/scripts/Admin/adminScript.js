window.onload = async () => {
    await validaSessaoAdmin();
} 

const adminHome = () => {
    const home = document.querySelector('#home');
    home.innerHTML = `<div class="row align-items-center text-white" >
        <!-- START THE CONTENT FOR THE INTRO  -->
        <div  class="col-md-4 intros text-start">
        <h1 class="display-2">
            <span class="display-2--intro">Bem-vindo, administrador</span>
            <span class="display-2--description lh-base">
            Ao lado estão as funcionalidades disponíveis. 
            </span>
        </h1>
        </div>
        <div class="col-md-4">
        <img src="../images/services/service-2.png" style="margin-left: 5rem; max-width: 100%; ">
        </div>
        <!-- START THE CONTENT FOR THE VIDEO -->
        <div id="funcionalidades"  class="col-md-4 intros text-end">
        <div class="list-group" style="gap: 3px; text-align: center;">
            <button class="list-group-item list-group-item-action" style="cursor: pointer; " onclick="gerenciarTipos()">Gerenciar Tipos</button>
            <button class="list-group-item list-group-item-action" style="cursor: pointer; " onclick="gerenciarOrgao()">Gerenciar Órgãos Públicos</button>
            <button class="list-group-item list-group-item-action" style="cursor: pointer; " onclick="visualizarDenuncias()">Visualizar Denúncias</button>
            <button class="list-group-item list-group-item-action" style="cursor: pointer; " onclick="registrarAdmin()">Cadastrar administrador</button>
            <button class="list-group-item list-group-item-action" style="cursor: pointer; " onclick="emitirRelatorio()">Relação de denúncias</button>
        </div>
        </div>
  </div>
  `;
}

const preparaTabela = () => {
    const home = document.querySelector('#home');
    home.innerHTML = `    
        <table class="table table-secondary table-hover" id="table"></table>
        <section id="formSection"></section>
        <div id="mensagemDiv" style="display:flex; justify-content:center; margin: 10px;">
            <p id="mensagem" style="color: white;"></p>
        </div>
        <section id="buttonSection"></section>
    `;
}

const registerAdminView = () => {
    let interact = document.querySelector("#home");
    const container = criarElemento('div', { class: 'container' });
  
    const innerRow = criarElemento('div', { class: 'row text-white' });
  
    const leftColumn = criarElemento('div', { class: 'col-12 col-lg-6 gradient shadow p-3' });
    const ctaInfoLeft = criarElemento('div', { class: 'cta-info w-100' });
    const h4Left = criarElemento('h4', { class: 'display-4 fw-bold' }, 'Cadastrar novo administrador');
    const p1Left = criarElemento('h6', { class: 'lh-lg' }, 'Precisando expandir a tripulação? Traga-os a bordo por aqui!');
    const p2Left = criarElemento('p', { class: 'lh-lg' }, 'Fique tranquilo, seus dados estarão seguros e anônimos.');    
  
    ctaInfoLeft.appendChild(h4Left);
    ctaInfoLeft.appendChild(p1Left);
    ctaInfoLeft.appendChild(p2Left);
    leftColumn.appendChild(ctaInfoLeft);
    innerRow.appendChild(leftColumn);
  
    const rightColumn = criarElemento('div', { class: 'col-12 col-lg-6 bg-white shadow p-3' });
    const formRight = criarElemento('div', { class: 'form w-100 pb-2' });
    const form = criarElemento('form', { action: '#', class: 'row' }, 'Cadastro');
    const col1 = criarElemento('div', { class: 'col-lg-12 col-md mb-3' });
    const inputCPF = criarInput('text', 'CPF', 'cpfCadastro', 'cpfCadastro', 'shadow form-control form-control-lg');
    inputCPF.setAttribute('onkeyup', 'cpf()');
    inputCPF.setAttribute('maxlength', '14');
    const col2 = criarElemento('div', { class: 'col-lg-6 col-md mb-3' });
    const inputSenha = criarInput('password', 'Senha', 'senhaCadastro', 'senhaCadastro', 'shadow form-control form-control-lg');
    const col3 = criarElemento('div', { class: 'col-lg-6 col-md mb-3' });
    const inputSenhaRep = criarInput('password', 'Repita a senha', 'senhaRepetida', 'senhaRepetida', 'shadow form-control form-control-lg');
    const col4 = criarElemento('div', { class: 'col-lg-12 mb-3' });
    const inputEmail = criarInput('email', 'Email', 'emailCadastro', 'emailCadastro', 'shadow form-control form-control-lg');
    const buttonDiv = criarElemento('div', { class: 'text-center d-grid mt-1' });
    const button = criarBotao('submit', 'Cadastrar!', null, 'btn btn-primary rounded-pill pt-3 pb-3');
  
    col1.appendChild(inputEmail);
    col2.appendChild(inputSenha);
    col3.appendChild(inputSenhaRep);
    col4.appendChild(inputCPF);
    buttonDiv.appendChild(button);
  
    form.appendChild(col1);
    form.appendChild(col2);
    form.appendChild(col3);
    form.appendChild(col4);
    const par = criarElemento('p', { class: 'mensagem-denuncia', id: 'mensagem' });
    form.appendChild(par);
    form.appendChild(buttonDiv);
    formRight.appendChild(form);
    rightColumn.appendChild(formRight);
  
    const buttonRow = criarElemento('div', { class: 'text-center d-grid mt-3', style: 'max-width: 50%; margin: 0 auto;' });
    const buttonBack = criarBotao('button', 'Voltar', 'window.location.reload()', 'btn btn-primary rounded-pill pt-3 pb-3');
  
    buttonRow.appendChild(buttonBack);
    rightColumn.appendChild(buttonRow);
  
    innerRow.appendChild(rightColumn);
    container.appendChild(innerRow);
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await registerAdmin();
    })
    interact.innerHTML = "";
    interact.appendChild(container);
    
  }

const gerenciarTipos = async () => {
    preparaTabela();
    await tipoControl();
}

const gerenciarOrgao = async () => {
    preparaTabela();
    await orgaoControl();
}

const visualizarDenuncias = async () => {
    preparaTabela();
    await denunciaControl();
}

const registrarAdmin = async () => {
    registerAdminView();
}