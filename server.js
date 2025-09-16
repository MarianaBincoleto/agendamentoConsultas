// server.js
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = 3000;

// Configurações básicas
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // pasta com HTML/CSS/JS

// Conexão com o banco SQLite
const db = new sqlite3.Database("agendamentos.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

// Criação das tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS specialties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    specialty TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );`);

  // Inserir especialidades exemplo
  const specialties = [
    "Cardiologia",
    "Dermatologia",
    "Ginecologia",
    "Pediatria",
  ];
  specialties.forEach((s) => {
    db.run("INSERT OR IGNORE INTO specialties (name) VALUES (?)", [s]);
  });
});

// Rota para agendar consulta
app.post("/api/agendar", (req, res) => {
  const { paciente, medico, data, horario } = req.body;

  if (!paciente || !medico || !data || !horario) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  const sql = `INSERT INTO appointments (name, specialty, date, time) VALUES (?, ?, ?, ?)`;
  db.run(sql, [paciente, medico, data, horario], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.json({
      sucesso: true,
      consulta: {
        id: this.lastID,
        paciente,
        medico,
        data,
        horario,
      },
    });
  });
});

// Rota para listar consultas
app.get("/api/consultas", (req, res) => {
  db.all("SELECT * FROM appointments ORDER BY date, time", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
