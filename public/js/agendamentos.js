const form = document.getElementById("formConsulta");
const lista = document.getElementById("lista");
const selectPaciente = document.getElementById("paciente_id");
const selectMedico = document.getElementById("medico_id");

async function carregarCombos() {
  const pacientes = await api.get("/api/pacientes");
  const medicos = await api.get("/api/medicos");

  selectPaciente.innerHTML = `<option value="">Selecione</option>` + pacientes.map(p => `
    <option value="${p.id}">${p.nome}</option>
  `).join("");

  selectMedico.innerHTML = `<option value="">Selecione</option>` + medicos.map(m => `
    <option value="${m.id}">${m.nome} - ${m.especialidade}</option>
  `).join("");
}

async function carregarConsultas() {
  const consultas = await api.get("/api/consultas");

  lista.innerHTML = consultas.map(c => `
    <tr>
      <td>${c.data_consulta}</td>
      <td>${c.hora_consulta}</td>
      <td>${c.paciente}</td>
      <td>${c.medico}</td>
      <td>${c.especialidade}</td>
      <td>
        <select onchange="alterarStatus(${c.id}, this.value)">
          ${["Agendada", "Realizada", "Cancelada", "Remarcada"].map(s => `
            <option ${s === c.status ? "selected" : ""}>${s}</option>
          `).join("")}
        </select>
      </td>
      <td class="actions">
        <button class="btn-danger" onclick="excluir(${c.id})">Excluir</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    paciente_id: document.getElementById("paciente_id").value,
    medico_id: document.getElementById("medico_id").value,
    data_consulta: document.getElementById("data_consulta").value,
    hora_consulta: document.getElementById("hora_consulta").value,
    observacoes: document.getElementById("observacoes").value
  };

  try {
    await api.post("/api/consultas", dados);
    mostrarMensagem("Consulta agendada com sucesso.");
    form.reset();
    carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
});

async function alterarStatus(id, status) {
  try {
    await api.put(`/api/consultas/${id}/status`, { status });
    mostrarMensagem("Status atualizado com sucesso.");
    carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

async function excluir(id) {
  if (!confirm("Deseja excluir esta consulta?")) return;

  try {
    await api.delete(`/api/consultas/${id}`);
    mostrarMensagem("Consulta excluída com sucesso.");
    carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

async function iniciar() {
  await carregarCombos();
  await carregarConsultas();
}

iniciar();
