-- Cria tabelas iniciais
CREATE TABLE IF NOT EXISTS specialties (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS appointments (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
phone TEXT,
specialty TEXT NOT NULL,
date TEXT NOT NULL, -- YYYY-MM-DD
time TEXT NOT NULL, -- HH:MM
status TEXT NOT NULL DEFAULT 'scheduled',
created_at TEXT DEFAULT (datetime('now','localtime'))
);


-- Inserir especialidades de exemplo
INSERT OR IGNORE INTO specialties (name) VALUES ('Cardiologia');
INSERT OR IGNORE INTO specialties (name) VALUES ('Dermatologia');
INSERT OR IGNORE INTO specialties (name) VALUES ('Ginecologia');
INSERT OR IGNORE INTO specialties (name) VALUES ('Pediatria');