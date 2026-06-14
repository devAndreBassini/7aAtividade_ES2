const form = document.getElementById("formRelatorio");
const selectMedico = document.getElementById("medico_id");

async function carregarMedicos() {
  const medicos = await api.get("/api/medicos");

  selectMedico.innerHTML = `<option value="">Todos</option>` + medicos.map(m => `
    <option value="${m.id}">${m.nome} - ${m.especialidade}</option>
  `).join("");
}

async function carregarResumo() {
  const resumo = await api.get("/api/relatorios/resumo");

  document.getElementById("totalPacientes").innerText = resumo.totalPacientes;
  document.getElementById("totalMedicos").innerText = resumo.totalMedicos;
  document.getElementById("totalEspecialidades").innerText = resumo.totalEspecialidades;
  document.getElementById("totalConsultas").innerText = resumo.totalConsultas;

  document.getElementById("listaStatus").innerHTML = resumo.porStatus.map(item => `
    <tr><td>${item.status}</td><td>${item.total}</td></tr>
  `).join("");

  document.getElementById("listaMedicos").innerHTML = resumo.porMedico.map(item => `
    <tr><td>${item.medico}</td><td>${item.total}</td></tr>
  `).join("");
}

async function gerarRelatorio() {
  const params = new URLSearchParams();

  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;
  const medicoId = document.getElementById("medico_id").value;
  const status = document.getElementById("status").value;

  if (inicio) params.append("inicio", inicio);
  if (fim) params.append("fim", fim);
  if (medicoId) params.append("medico_id", medicoId);
  if (status) params.append("status", status);

  const consultas = await api.get(`/api/relatorios/consultas?${params.toString()}`);

  document.getElementById("listaConsultas").innerHTML = consultas.map(c => `
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
  await gerarRelatorio();
});

async function iniciar() {
  await carregarMedicos();
  await carregarResumo();
  await gerarRelatorio();
}

iniciar();
