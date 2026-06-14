const express = require("express");
const path = require("path");
const { db, initDatabase } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

initDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function ok(res, data) {
  res.json({ success: true, data });
}

function fail(res, status, message) {
  res.status(status).json({ success: false, message });
}

// -------------------- PACIENTES --------------------

app.get("/api/pacientes", (req, res) => {
  const rows = db.prepare("SELECT * FROM pacientes ORDER BY nome").all();
  ok(res, rows);
});

app.post("/api/pacientes", (req, res) => {
  const { nome, cpf, telefone, email, data_nascimento } = req.body;

  if (!nome) {
    return fail(res, 400, "O nome do paciente é obrigatório.");
  }

  const result = db.prepare(`
    INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento)
    VALUES (?, ?, ?, ?, ?)
  `).run(nome, cpf || "", telefone || "", email || "", data_nascimento || "");

  ok(res, { id: result.lastInsertRowid });
});

app.put("/api/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, email, data_nascimento } = req.body;

  if (!nome) {
    return fail(res, 400, "O nome do paciente é obrigatório.");
  }

  db.prepare(`
    UPDATE pacientes
    SET nome = ?, cpf = ?, telefone = ?, email = ?, data_nascimento = ?
    WHERE id = ?
  `).run(nome, cpf || "", telefone || "", email || "", data_nascimento || "", id);

  ok(res, { id });
});

app.delete("/api/pacientes/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM pacientes WHERE id = ?").run(req.params.id);
    ok(res, { id: req.params.id });
  } catch (error) {
    fail(res, 400, "Não foi possível excluir. O paciente pode possuir consultas vinculadas.");
  }
});

// -------------------- ESPECIALIDADES --------------------

app.get("/api/especialidades", (req, res) => {
  const rows = db.prepare("SELECT * FROM especialidades ORDER BY nome").all();
  ok(res, rows);
});

app.post("/api/especialidades", (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome) {
    return fail(res, 400, "O nome da especialidade é obrigatório.");
  }

  try {
    const result = db.prepare(`
      INSERT INTO especialidades (nome, descricao)
      VALUES (?, ?)
    `).run(nome, descricao || "");

    ok(res, { id: result.lastInsertRowid });
  } catch (error) {
    fail(res, 400, "Especialidade já cadastrada.");
  }
});

app.put("/api/especialidades/:id", (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;

  if (!nome) {
    return fail(res, 400, "O nome da especialidade é obrigatório.");
  }

  db.prepare(`
    UPDATE especialidades
    SET nome = ?, descricao = ?
    WHERE id = ?
  `).run(nome, descricao || "", id);

  ok(res, { id });
});

app.delete("/api/especialidades/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM especialidades WHERE id = ?").run(req.params.id);
    ok(res, { id: req.params.id });
  } catch (error) {
    fail(res, 400, "Não foi possível excluir. A especialidade pode possuir médicos vinculados.");
  }
});

// -------------------- MÉDICOS --------------------

app.get("/api/medicos", (req, res) => {
  const rows = db.prepare(`
    SELECT m.*, e.nome AS especialidade
    FROM medicos m
    JOIN especialidades e ON e.id = m.especialidade_id
    ORDER BY m.nome
  `).all();

  ok(res, rows);
});

app.post("/api/medicos", (req, res) => {
  const { nome, crm, telefone, email, especialidade_id } = req.body;

  if (!nome || !crm || !especialidade_id) {
    return fail(res, 400, "Nome, CRM e especialidade são obrigatórios.");
  }

  const result = db.prepare(`
    INSERT INTO medicos (nome, crm, telefone, email, especialidade_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(nome, crm, telefone || "", email || "", especialidade_id);

  ok(res, { id: result.lastInsertRowid });
});

app.put("/api/medicos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, crm, telefone, email, especialidade_id } = req.body;

  if (!nome || !crm || !especialidade_id) {
    return fail(res, 400, "Nome, CRM e especialidade são obrigatórios.");
  }

  db.prepare(`
    UPDATE medicos
    SET nome = ?, crm = ?, telefone = ?, email = ?, especialidade_id = ?
    WHERE id = ?
  `).run(nome, crm, telefone || "", email || "", especialidade_id, id);

  ok(res, { id });
});

app.delete("/api/medicos/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM medicos WHERE id = ?").run(req.params.id);
    ok(res, { id: req.params.id });
  } catch (error) {
    fail(res, 400, "Não foi possível excluir. O médico pode possuir consultas vinculadas.");
  }
});

// -------------------- CONSULTAS / AGENDAMENTOS --------------------

app.get("/api/consultas", (req, res) => {
  const { medico_id, data } = req.query;

  let sql = `
    SELECT c.*, 
           p.nome AS paciente,
           m.nome AS medico,
           e.nome AS especialidade
    FROM consultas c
    JOIN pacientes p ON p.id = c.paciente_id
    JOIN medicos m ON m.id = c.medico_id
    JOIN especialidades e ON e.id = m.especialidade_id
    WHERE 1 = 1
  `;

  const params = [];

  if (medico_id) {
    sql += " AND c.medico_id = ?";
    params.push(medico_id);
  }

  if (data) {
    sql += " AND c.data_consulta = ?";
    params.push(data);
  }

  sql += " ORDER BY c.data_consulta, c.hora_consulta";

  const rows = db.prepare(sql).all(...params);
  ok(res, rows);
});

app.post("/api/consultas", (req, res) => {
  const { paciente_id, medico_id, data_consulta, hora_consulta, observacoes } = req.body;

  if (!paciente_id || !medico_id || !data_consulta || !hora_consulta) {
    return fail(res, 400, "Paciente, médico, data e hora são obrigatórios.");
  }

  try {
    const result = db.prepare(`
      INSERT INTO consultas (paciente_id, medico_id, data_consulta, hora_consulta, status, observacoes)
      VALUES (?, ?, ?, ?, 'Agendada', ?)
    `).run(paciente_id, medico_id, data_consulta, hora_consulta, observacoes || "");

    ok(res, { id: result.lastInsertRowid });
  } catch (error) {
    fail(res, 400, "Já existe consulta para esse médico nesta data e horário.");
  }
});

app.put("/api/consultas/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const permitidos = ["Agendada", "Realizada", "Cancelada", "Remarcada"];

  if (!permitidos.includes(status)) {
    return fail(res, 400, "Status inválido.");
  }

  db.prepare("UPDATE consultas SET status = ? WHERE id = ?").run(status, id);
  ok(res, { id, status });
});

app.delete("/api/consultas/:id", (req, res) => {
  db.prepare("DELETE FROM consultas WHERE id = ?").run(req.params.id);
  ok(res, { id: req.params.id });
});

// -------------------- RELATÓRIOS --------------------

app.get("/api/relatorios/resumo", (req, res) => {
  const totalPacientes = db.prepare("SELECT COUNT(*) AS total FROM pacientes").get().total;
  const totalMedicos = db.prepare("SELECT COUNT(*) AS total FROM medicos").get().total;
  const totalEspecialidades = db.prepare("SELECT COUNT(*) AS total FROM especialidades").get().total;
  const totalConsultas = db.prepare("SELECT COUNT(*) AS total FROM consultas").get().total;

  const porStatus = db.prepare(`
    SELECT status, COUNT(*) AS total
    FROM consultas
    GROUP BY status
    ORDER BY status
  `).all();

  const porMedico = db.prepare(`
    SELECT m.nome AS medico, COUNT(c.id) AS total
    FROM medicos m
    LEFT JOIN consultas c ON c.medico_id = m.id
    GROUP BY m.id
    ORDER BY total DESC, m.nome
  `).all();

  ok(res, {
    totalPacientes,
    totalMedicos,
    totalEspecialidades,
    totalConsultas,
    porStatus,
    porMedico
  });
});

app.get("/api/relatorios/consultas", (req, res) => {
  const { inicio, fim, medico_id, status } = req.query;

  let sql = `
    SELECT c.*, p.nome AS paciente, m.nome AS medico, e.nome AS especialidade
    FROM consultas c
    JOIN pacientes p ON p.id = c.paciente_id
    JOIN medicos m ON m.id = c.medico_id
    JOIN especialidades e ON e.id = m.especialidade_id
    WHERE 1 = 1
  `;

  const params = [];

  if (inicio) {
    sql += " AND c.data_consulta >= ?";
    params.push(inicio);
  }

  if (fim) {
    sql += " AND c.data_consulta <= ?";
    params.push(fim);
  }

  if (medico_id) {
    sql += " AND c.medico_id = ?";
    params.push(medico_id);
  }

  if (status) {
    sql += " AND c.status = ?";
    params.push(status);
  }

  sql += " ORDER BY c.data_consulta, c.hora_consulta";

  ok(res, db.prepare(sql).all(...params));
});

app.listen(PORT, () => {
  console.log(`Sistema da clínica rodando em http://localhost:${PORT}`);
});
