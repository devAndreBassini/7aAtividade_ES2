const form = document.getElementById("formPaciente");
const lista = document.getElementById("lista");

async function carregarPacientes() {
  const pacientes = await api.get("/api/pacientes");

  lista.innerHTML = pacientes.map(p => `
    <tr>
      <td>${p.nome}</td>
      <td>${p.cpf || ""}</td>
      <td>${p.telefone || ""}</td>
      <td>${p.email || ""}</td>
      <td>${p.data_nascimento || ""}</td>
      <td class="actions">
        <button onclick='editar(${JSON.stringify(p)})'>Editar</button>
        <button class="btn-danger" onclick="excluir(${p.id})">Excluir</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value;

  const dados = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    data_nascimento: document.getElementById("data_nascimento").value
  };

  try {
    if (id) {
      await api.put(`/api/pacientes/${id}`, dados);
      mostrarMensagem("Paciente atualizado com sucesso.");
    } else {
      await api.post("/api/pacientes", dados);
      mostrarMensagem("Paciente cadastrado com sucesso.");
    }

    limparFormulario();
    carregarPacientes();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
});

function editar(p) {
  document.getElementById("id").value = p.id;
  document.getElementById("nome").value = p.nome;
  document.getElementById("cpf").value = p.cpf || "";
  document.getElementById("telefone").value = p.telefone || "";
  document.getElementById("email").value = p.email || "";
  document.getElementById("data_nascimento").value = p.data_nascimento || "";
}

async function excluir(id) {
  if (!confirm("Deseja excluir este paciente?")) return;

  try {
    await api.delete(`/api/pacientes/${id}`);
    mostrarMensagem("Paciente excluído com sucesso.");
    carregarPacientes();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

function limparFormulario() {
  form.reset();
  document.getElementById("id").value = "";
}

carregarPacientes();
