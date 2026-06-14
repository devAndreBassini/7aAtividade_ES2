const form = document.getElementById("formEspecialidade");
const lista = document.getElementById("lista");

async function carregarEspecialidades() {
  const especialidades = await api.get("/api/especialidades");

  lista.innerHTML = especialidades.map(e => `
    <tr>
      <td>${e.nome}</td>
      <td>${e.descricao || ""}</td>
      <td class="actions">
        <button onclick='editar(${JSON.stringify(e)})'>Editar</button>
        <button class="btn-danger" onclick="excluir(${e.id})">Excluir</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value;

  const dados = {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value
  };

  try {
    if (id) {
      await api.put(`/api/especialidades/${id}`, dados);
      mostrarMensagem("Especialidade atualizada com sucesso.");
    } else {
      await api.post("/api/especialidades", dados);
      mostrarMensagem("Especialidade cadastrada com sucesso.");
    }

    limparFormulario();
    carregarEspecialidades();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
});

function editar(e) {
  document.getElementById("id").value = e.id;
  document.getElementById("nome").value = e.nome;
  document.getElementById("descricao").value = e.descricao || "";
}

async function excluir(id) {
  if (!confirm("Deseja excluir esta especialidade?")) return;

  try {
    await api.delete(`/api/especialidades/${id}`);
    mostrarMensagem("Especialidade excluída com sucesso.");
    carregarEspecialidades();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

function limparFormulario() {
  form.reset();
  document.getElementById("id").value = "";
}

carregarEspecialidades();
