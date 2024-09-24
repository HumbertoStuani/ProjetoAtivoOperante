const register = async () => {
  const email = document.querySelector('#emailCadastro').value;
  const senha = document.querySelector('#senhaCadastro').value;
  const senhaRepetida = document.querySelector('#senhaRepetida').value
  const cpf = document.querySelector('#cpfCadastro').value;
  const mensagem = document.querySelector('#mensagem');
  if (!email) {
      mensagem.innerHTML = 'Insira um email';
      return;
  }
  if (!cpf) {
      mensagem.innerHTML = 'Informe um CPF';
      return;
  }
  if (senha.trim() === '' || senha.length < 8) {
      mensagem.innerHTML = 'Senha precisa ser maior';
      return;
  }
  if (senha !== senhaRepetida) {
      mensagem.innerHTML = 'As senhas não coincidem';
      return;
  }
  let usuario = {
    email: email,
    senha: senha,
    cpf: cpf
  };
  try {
    const loginResponse = await fetch('http://localhost:8080/access/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    })
    if(loginResponse.ok) {
      const token = await loginResponse.text();
      localStorage.setItem('token', token);
      const accessResponse = await fetch('http://localhost:8080/access?token=' + token, {
        method: 'GET',
      })
      const access = parseInt(await accessResponse.text());
      localStorage.setItem('access', access); 
      redirect(access);
    }
    else
      alert('Email já cadastrado');

  } catch (err) {
    console.error(err);
  }
}

const verificaSessao = () => {
  const botao = document.querySelector('#botaoDinamico');
  const token = localStorage.getItem('token');
  const access = localStorage.getItem('access');
  if(token && access) {
      botao.innerHTML = 'Minha página<span><i class="fas fa-home"></i></span>';
      botao.addEventListener('click', () => redirect(parseInt(access)));
      document.querySelector('#botaoCadastro').innerHTML = '';
  }
  else {
    if(access)
      localStorage.removeItem('access');
    botao.innerHTML = 'Login<span><i class="fas fa-home"></i></span>';
    botao.addEventListener('click', () => loginView());
    document.querySelector('#botaoCadastro').innerHTML = `
      <button type="button" onclick="registerView()" class="rounded-pill btn-rounded">
        Cadastre-se
        <span><i class="fas fa-arrow-right"></i></span>
      </button>
    `;
  }
}

const redirect = (access) => {
  if(access === 1) {
    window.location.href = './views/AdminView.html';
  } else if (access === 2) {  
    window.location.href = './views/CidadaoView.html';
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    alert('Houve um erro com seu nível de acesso. Status: inválido');
  }
}

const login = async () => {
    const email = document.querySelector('#emailLogin').value;
    const senha = document.querySelector('#senhaLogin').value;
    const mensagem = document.querySelector('#mensagem');
    if (!email) {
        mensagem.innerHTML = 'Insira um email';
        return;
    }
    if (senha.trim() === '') {
        mensagem.innerHTML = 'Informe uma senha';
        return;
    }
    let usuario = { email: email, senha: senha };
    try {
        const res = await fetch('http://localhost:8080/access/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
        })
        const token = await res.text();
        localStorage.setItem('token', token);

        const accessResponse = await fetch('http://localhost:8080/access?token=' + token, {
        method: 'GET',
        })
        const access = parseInt(await accessResponse.text());
        localStorage.setItem('access', access); 
        redirect(access);

    } catch (err) {
        console.error(err);
    }
}

window.onload = verificaSessao();