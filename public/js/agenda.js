const form = document.getElementById("formFiltro");
const lista = document.getElementById("lista");
const selectMedico = document.getElementById("medico_id");

async function carregarMedicos() {
  const medicos = await api.get("/api/medicos");

  selectMedico.innerHTML = `<option value="">Todos</option>` + medicos.map(m => `
    <option value="${m.id}">${m.nome} - ${m.especialidade}</option>
  `).join("");
}

async function carregarAgenda() {
  const medicoId = document.getElementById("medico_id").value;
  const data = document.getElementById("data").value;

  const params = new URLSearchParams();

  if (medicoId) params.append("medico_id", medicoId);
  if (data) params.append("data", data);

  const consultas = await api.get(`/api/consultas?${params.toString()}`);

  lista.innerHTML = consultas.map(c => `
    <tr>
      <td>${c.data_consulta}</td>
      <td>${c.hora_consulta}</td>
      <td>${c.paciente}</td>
      <td>${c.medico}</td>
      <td>${c.especialidade}</td>
      <td>${c.status}</td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await carregarAgenda();
});

function limparFiltro() {
  form.reset();
  carregarAgenda();
}

async function iniciar() {
  await carregarMedicos();
  await carregarAgenda();
}

iniciar();
