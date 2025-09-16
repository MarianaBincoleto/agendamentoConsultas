// db.js — inicializa SQLite e aplica migrations simples
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "agendamento.db");
const MIGRATION_FILE = path.join(__dirname, "migrations.sql");

function init() {
  const db = new sqlite3.Database(DB_FILE);

  const migration = fs.readFileSync(MIGRATION_FILE, "utf8");
  db.exec(migration, (err) => {
    if (err) console.error("Erro aplicando migrations:", err);
  });

  return db;
}

module.exports = { init };
