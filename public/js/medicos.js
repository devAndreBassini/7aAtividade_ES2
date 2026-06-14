const form = document.getElementById("formMedico");
const lista = document.getElementById("lista");
const selectEspecialidade = document.getElementById("especialidade_id");

async function carregarEspecialidades() {
  const especialidades = await api.get("/api/especialidades");

  selectEspecialidade.innerHTML = `<option value="">Selecione</option>` + especialidades.map(e => `
    <option value="${e.id}">${e.nome}</option>
  `).join("");
}

async function carregarMedicos() {
  const medicos = await api.get("/api/medicos");

  lista.innerHTML = medicos.map(m => `
    <tr>
      <td>${m.nome}</td>
      <td>${m.crm}</td>
      <td>${m.telefone || ""}</td>
      <td>${m.email || ""}</td>
      <td>${m.especialidade}</td>
      <td class="actions">
        <button onclick='editar(${JSON.stringify(m)})'>Editar</button>
        <button class="btn-danger" onclick="excluir(${m.id})">Excluir</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value;

  const dados = {
    nome: document.getElementById("nome").value,
    crm: document.getElementById("crm").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    especialidade_id: document.getElementById("especialidade_id").value
  };

  try {
    if (id) {
      await api.put(`/api/medicos/${id}`, dados);
      mostrarMensagem("Médico atualizado com sucesso.");
    } else {
      await api.post("/api/medicos", dados);
      mostrarMensagem("Médico cadastrado com sucesso.");
    }

    limparFormulario();
    carregarMedicos();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
});

function editar(m) {
  document.getElementById("id").value = m.id;
  document.getElementById("nome").value = m.nome;
  document.getElementById("crm").value = m.crm;
  document.getElementById("telefone").value = m.telefone || "";
  document.getElementById("email").value = m.email || "";
  document.getElementById("especialidade_id").value = m.especialidade_id;
}

async function excluir(id) {
  if (!confirm("Deseja excluir este médico?")) return;

  try {
    await api.delete(`/api/medicos/${id}`);
    mostrarMensagem("Médico excluído com sucesso.");
    carregarMedicos();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

function limparFormulario() {
  form.reset();
  document.getElementById("id").value = "";
}

async function iniciar() {
  await carregarEspecialidades();
  await carregarMedicos();
}

iniciar();
