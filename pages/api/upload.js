import formidable from "formidable";
import fs from "fs";
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // Important pour désactiver le body parser par défaut de Next.js
    },
};

export default function handler(req, res) {
    if (req.method === 'POST') {

        const form = formidable({
            maxFileSize: Infinity, // Pas de limite de taille
            keepExtensions: true, //garde l'extension du fichier
        });

        const uploadDir = path.join(process.cwd(), '/public/uploads');

        // Assurez-vous que le répertoire de téléchargement existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        form.uploadDir = uploadDir; // Définir le dossier de destination
        form.keepExtensions = true; // Conserver les extensions de fichiers

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error parsing the form' });
            }

            // Fields from the form (nom, lien, desc)
            const { id_nom, id_lien, input_desc } = fields;

            // Log des champs pour voir ce qui est envoyé
            console.log('Champs de formulaire reçus :', fields);

            // Access the uploaded file
            const file = files.fileupload;
            

            // Vérifie si le fichier existe
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Manipulez les champs et les fichiers ici
            res.status(200).json({ message: 'Form processed successfully', fields, file });
        });
        
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
