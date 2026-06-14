const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(__dirname, "data");

// No Render, a pasta data pode não existir após o deploy.
// Por isso ela precisa ser criada antes de abrir o banco SQLite.
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "clinica.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT,
      telefone TEXT,
      email TEXT,
      data_nascimento TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS especialidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      descricao TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS medicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      crm TEXT NOT NULL,
      telefone TEXT,
      email TEXT,
      especialidade_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (especialidade_id) REFERENCES especialidades(id)
    );

    CREATE TABLE IF NOT EXISTS consultas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      medico_id INTEGER NOT NULL,
      data_consulta TEXT NOT NULL,
      hora_consulta TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Agendada',
      observacoes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
      FOREIGN KEY (medico_id) REFERENCES medicos(id),
      UNIQUE(medico_id, data_consulta, hora_consulta)
    );
  `);

  const countEspecialidades = db.prepare("SELECT COUNT(*) AS total FROM especialidades").get().total;

  if (countEspecialidades === 0) {
    const insert = db.prepare("INSERT INTO especialidades (nome, descricao) VALUES (?, ?)");
    insert.run("Clínica Geral", "Atendimento médico geral.");
    insert.run("Cardiologia", "Especialidade relacionada ao coração.");
    insert.run("Pediatria", "Atendimento médico infantil.");
    insert.run("Ortopedia", "Tratamento de ossos, músculos e articulações.");
  }
}

module.exports = {
  db,
  initDatabase
};
