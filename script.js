
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('formCadastroCompleto').addEventListener('submit', salvarCadastro);
});

function abrirCadastroCompleto() {
  esconderTodos();
  document.getElementById('formularioCompleto').classList.remove('hidden');
}

function visualizarEventosAgendados() {
  esconderTodos();
  document.getElementById('listaEventos').classList.remove('hidden');
  filtrarEventosPorData();
}

function abrirBuscaCliente() {
  esconderTodos();
  document.getElementById('buscaCliente').classList.remove('hidden');
}

function esconderTodos() {
  document.getElementById('formularioCompleto').classList.add('hidden');
  document.getElementById('listaEventos').classList.add('hidden');
  document.getElementById('buscaCliente').classList.add('hidden');
}

function salvarCadastro(e) {
  e.preventDefault();

  const cliente = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    insta: document.getElementById('insta').value,
    endereco: document.getElementById('endereco').value,
    cpf: document.getElementById('cpf').value,
    evento: {
      tipo: document.getElementById('tipo').value,
      data: document.getElementById('dataEvento').value,
      valorTotal: Number(document.getElementById('valorTotal').value),
      valorPago: Number(document.getElementById('valorPago').value)
    }
  };

  db.collection("clientes").add(cliente)
    .then(() => {
      alert("Cadastro salvo com sucesso!");
      document.getElementById('formCadastroCompleto').reset();
    })
    .catch((error) => {
      console.error("Erro ao salvar:", error);
    });
}

function filtrarEventosPorData() {
  const dataSelecionada = document.getElementById('filtroData').value;
  const lista = document.getElementById('eventosFiltrados');
  lista.innerHTML = '';

  db.collection("clientes").get().then((querySnapshot) => {
    const eventos = [];

    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      if (dados.evento && dados.evento.data === dataSelecionada) {
        eventos.push(dados);
      }
    });

    eventos.sort((a, b) => a.evento.data.localeCompare(b.evento.data));

    eventos.forEach((c) => {
      const pendente = c.evento.valorTotal - c.evento.valorPago;
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${c.nome}</strong><br>
        Tipo: ${c.evento.tipo}<br>
        Data: ${c.evento.data}<br>
        💰 Valor: R$${c.evento.valorTotal} | Pago: R$${c.evento.valorPago} | Pendente: R$${pendente}
        <hr>
      `;
      lista.appendChild(li);
    });
  }).catch((error) => {
    console.error("Erro ao carregar do Firestore:", error);
  });
}

function buscarClientePorNome() {
  const nomeBusca = document.getElementById('nomeBusca').value.toLowerCase();
  const resultado = document.getElementById('resultadoBusca');
  resultado.innerHTML = '';

  db.collection("clientes").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      if (dados.nome.toLowerCase().includes(nomeBusca)) {
        const pendente = dados.evento.valorTotal - dados.evento.valorPago;
        resultado.innerHTML += `
          <p><strong>${dados.nome}</strong><br>
          Telefone: ${dados.telefone}<br>
          Instagram: ${dados.insta}<br>
          Endereço: ${dados.endereco}<br>
          CPF: ${dados.cpf}<br>
          Evento: ${dados.evento.tipo} - ${dados.evento.data}<br>
          Valor Total: R$${dados.evento.valorTotal} | Valor Pago: R$${dados.evento.valorPago} | Pendente: R$${pendente}
          <hr></p>
        `;
      }
    });
  }).catch((error) => {
    console.error("Erro ao buscar cliente:", error);
  });
}
