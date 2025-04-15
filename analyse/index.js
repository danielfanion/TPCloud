const functions = require('@google-cloud/functions-framework');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const mysql = require('mysql2/promise');

const vision = new ImageAnnotatorClient();
const DB_HOST = "104.199.46.232";
const DB_USER = "root";
const DB_PASS = "password";
const DB_NAME = "photos"

functions.cloudEvent('analyse', async (cloudEvent) => {
  const bucketName = "fanion_public";
  const fileName = cloudEvent.data.name;

  console.log(`Fichier ${fileName} dans le bucket ${bucketName}`);

  try {
    const [result] = await vision.labelDetection(`gs://${bucketName}/${fileName}`);
    const labels = result.labelAnnotations.map(label => label.description);

    console.log('Tags :', labels);

    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const tagsStr = labels.join(', ');

    await connection.execute(
      'UPDATE photos SET tags = ? WHERE url = ?',
      [tagsStr, imageUrl]
    );

    await connection.end();
    console.log('MAJ des tags OK');
  } catch (err) {
    console.error('Erreur :', err);
  }
});
