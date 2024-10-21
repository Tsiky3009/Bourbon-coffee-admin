// pages/api/file_upload.js

import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

// Configuration OAuth2 pour Google Drive
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, // ID client
  process.env.CLIENT_SECRET, // Secret client
  process.env.REDIRECT_URI // URI de redirection
);

// Utilisez un token d'actualisation pour l'authentification
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export const config = {
  api: {
    bodyParser: false, // Pour permettre l'utilisation de formidable
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Parse la requête avec formidable pour obtenir le fichier
    const form = formidable();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de l’analyse du fichier.' });
      }

      const file = files.file;
      const filePath = file.filepath; // Chemin du fichier téléchargé sur le serveur
      const mimeType = file.mimetype; // Type MIME du fichier
      const fileName = file.originalFilename; // Nom original du fichier

      try {
        // Préparez le fichier à uploader vers Google Drive
        const fileMetadata = {
          name: fileName,
        };

        const media = {
          mimeType: mimeType,
          body: fs.createReadStream(filePath), // Lit le fichier pour l'upload
        };

        // Effectuez la requête POST vers l'API Google Drive
        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id', // Vous pouvez obtenir plus de métadonnées si nécessaire
        });

        // Si l'upload est réussi, retournez l'ID du fichier
        res.status(200).json({
          message: 'Fichier téléchargé avec succès!',
          fileId: response.data.id,
        });
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l’upload vers Google Drive.', error });
      } finally {
        // Supprimez le fichier temporaire après l'upload
        fs.unlink(filePath, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier temporaire :', err);
        });
      }
    });
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
