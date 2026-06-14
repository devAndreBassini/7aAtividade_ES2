const { db, initDatabase } = require("./database");

initDatabase();

const especialidadeClinica = db.prepare("SELECT id FROM especialidades WHERE nome = ?").get("Clínica Geral").id;
const especialidadeCardio = db.prepare("SELECT id FROM especialidades WHERE nome = ?").get("Cardiologia").id;

const insertPaciente = db.prepare(`
  INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMedico = db.prepare(`
  INSERT INTO medicos (nome, crm, telefone, email, especialidade_id)
  VALUES (?, ?, ?, ?, ?)
`);

const insertConsulta = db.prepare(`
  INSERT INTO consultas (paciente_id, medico_id, data_consulta, hora_consulta, status, observacoes)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const p1 = insertPaciente.run("Maria Oliveira", "111.111.111-11", "(31) 99999-1111", "maria@email.com", "1985-04-10").lastInsertRowid;
const p2 = insertPaciente.run("João Santos", "222.222.222-22", "(31) 99999-2222", "joao@email.com", "1992-08-20").lastInsertRowid;

const m1 = insertMedico.run("Dra. Ana Souza", "CRM-MG 12345", "(31) 3333-1111", "ana@clinica.com", especialidadeClinica).lastInsertRowid;
const m2 = insertMedico.run("Dr. Carlos Lima", "CRM-MG 54321", "(31) 3333-2222", "carlos@clinica.com", especialidadeCardio).lastInsertRowid;

insertConsulta.run(p1, m1, "2026-06-20", "09:00", "Agendada", "Primeira consulta.");
insertConsulta.run(p2, m2, "2026-06-20", "10:00", "Agendada", "Retorno.");

console.log("Dados de exemplo inseridos com sucesso.");
