CREATE TABLE specialties (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE appointments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    specialty NVARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'scheduled',
    created_at DATETIME DEFAULT GETDATE()
);

-- Inserir especialidades de exemplo
INSERT INTO specialties (name) VALUES ('Cardiologia');
INSERT INTO specialties (name) VALUES ('Dermatologia');
INSERT INTO specialties (name) VALUES ('Ginecologia');
INSERT INTO specialties (name) VALUES ('Pediatria');