// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { poolPromise } = require("./db"); // Usa Azure SQL
const app = express();
const PORT = 3000;

// Configurações básicas
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // pasta com HTML/CSS/JS

// Rota para agendar consulta usando Azure SQL
app.post("/api/agendar", async (req, res) => {
  const { paciente, medico, data, horario } = req.body;

  if (!paciente || !medico || !data || !horario) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("name", paciente)
      .input("specialty", medico)
      .input("date", data)
      .input("time", horario)
      .query(
        "INSERT INTO appointments (name, specialty, date, time) OUTPUT INSERTED.id VALUES (@name, @specialty, @date, @time)"
      );

    const id = result.recordset[0].id;

    res.json({
      sucesso: true,
      consulta: {
        id,
        paciente,
        medico,
        data,
        horario,
      },
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Rota para listar consultas usando Azure SQL
app.get("/api/consultas", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM appointments ORDER BY date, time");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
