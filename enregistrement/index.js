const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const mysql = require('mysql2/promise');
const moment = require('moment');

const storage = new Storage();

const sourceBucketName = 'fanion_depot';
const destinationBucketName = 'fanion_public';
const DB_HOST = "104.199.46.232";
const DB_USER = "user";
const DB_PASS = "user";
const DB_NAME = "photos"

functions.cloudEvent('enregistrement', async cloudEvent => {
  const file = cloudEvent.data;
  const fileName = file.name;

  const isJPG = fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg');
  if (!isJPG) {
    console.log('Fichier ignoré : pas un JPG/JPEG.');
    return;
  }

  const timestamp = moment().format('YYYYMMDDHHmmss');
  const newFileName = `${timestamp}.jpg`;

  const sourceBucket = storage.bucket(sourceBucketName);
  const destinationBucket = storage.bucket(destinationBucketName);
  const sourceFile = sourceBucket.file(fileName);
  const destinationFile = destinationBucket.file(newFileName);

  try {
    await sourceFile.copy(destinationFile);
    console.log(`Image copiée vers ${destinationBucketName}/${newFileName}`);

    await sourceFile.delete();
    console.log(`Image supprimée du dépôt : ${fileName}`);

    const publicUrl = `https://storage.googleapis.com/${destinationBucketName}/${newFileName}`;

    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    await connection.execute(
      'INSERT INTO photos (url, tags) VALUES (?, ?)',
      [publicUrl, null]
    );


    console.log(`Image enregistrée dans la base : ${publicUrl}`);
    await connection.end();
    
  } catch (error) {
    console.error('Erreur lors du traitement :', error);
  }
});
