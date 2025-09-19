const { poolPromise } = require('./db');

async function testarConexao() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 AS resultado');
    console.log('Resultado da query:', result.recordset);
  } catch (err) {
    console.error('Erro ao executar query:', err);
  }
}

testarConexao();
