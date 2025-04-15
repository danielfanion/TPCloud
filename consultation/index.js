const functions = require('@google-cloud/functions-framework');
const mysql = require('mysql2/promise');

const DB_HOST = "104.199.46.232";
const DB_USER = "user";
const DB_PASS = "user";
const DB_NAME = "photos"

functions.http('consultation', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    res.status(400).json({ error: 'Paramètre manquant' });
    return;
  }

  try {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM photos WHERE tags LIKE ?',
      [`%${query}%`]
    );

    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur SQL :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
