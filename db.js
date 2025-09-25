const sql = require("mssql");

const config = {
  user: "consulta", // seu usuário do Azure SQL
  password: "Abc12345678", // sua senha do Azure SQL
  server: "consultas-dados.database.windows.net", // endereço do servidor
  database: "dadosconsulta", // nome do banco de dados
  options: {
    encrypt: true, // Necessário para Azure
    trustServerCertificate: false,
  },
};

const poolPromise = sql
  .connect(config)
  .then((pool) => {
    console.log("Conectado ao Azure SQL!");
    return pool;
  })
  .catch((err) => {
    console.error("Erro de conexão:", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
