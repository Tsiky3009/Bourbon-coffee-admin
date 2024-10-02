// pages/api/file-upload.js
import formidable from "formidable";
import { promises as fsPromises } from "fs";
import path from "path";
import { MongoClient } from 'mongodb';
import libre from 'libreoffice-convert';

export const config = {
    api: {
        bodyParser: false,
    }
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Répertoire d'upload
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Assurez-vous que le répertoire existe
fsPromises.mkdir(uploadDir, { recursive: true }).catch(console.error);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm({
            uploadDir: uploadDir,
            keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form:", err);
                return res.status(500).json({ error: "Failed to upload file" });
            }

            const file = files.file;
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const filePath = file.filepath;
            const originalFileName = file.originalFilename;
            const fileExt = path.extname(originalFileName).toLowerCase();
            const baseName = path.basename(originalFileName, fileExt);

            // Types de fichiers supportant la conversion
            const convertibleTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
                'application/msword', // DOC
                'application/vnd.ms-excel', // XLS
                // Ajoutez d'autres types si nécessaire
            ];

            let pdfFilePath = '';

            try {
                // Vérifier si le fichier est convertible
                if (convertibleTypes.includes(file.mimetype) || ['.docx', '.xlsx', '.doc', '.xls'].includes(fileExt)) {
                    const input = await fsPromises.readFile(filePath);
                    const outputFormat = 'pdf';

                    const pdf = await new Promise((resolve, reject) => {
                        libre.convert(input, `.${outputFormat}`, undefined, (err, done) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(done);
                        });
                    });

                    // Définir le chemin pour le fichier PDF converti
                    pdfFilePath = path.join(uploadDir, `${baseName}.pdf`);

                    // Sauvegarder le PDF
                    await fsPromises.writeFile(pdfFilePath, pdf);

                    // Optionnel : Supprimer le fichier original après conversion
                    await fsPromises.unlink(filePath);
                } else {
                    // Si le fichier n'est pas convertible, le laisser tel quel
                    pdfFilePath = filePath;
                }

                // Connexion à MongoDB
                await client.connect();
                const database = client.db("bourbon");
                const collection = database.collection("files");

                // Préparer les données à insérer
                const fileData = {
                    originalFileName: originalFileName,
                    storedFileName: path.basename(pdfFilePath),
                    filePath: `/uploads/${path.basename(pdfFilePath)}`,
                    fileType: 'application/pdf',
                    uploadDate: new Date(),
                };

                // Insérer dans la base de données
                const result = await collection.insertOne(fileData);

                return res.status(200).json({
                    message: "File uploaded and converted successfully",
                    fileUrl: fileData.filePath,
                    databaseId: result.insertedId
                });
            } catch (conversionError) {
                console.error("Error during file conversion or saving:", conversionError);
                return res.status(500).json({ error: "Failed to convert or save the file" });
            } finally {
                await client.close();
            }
        });
    } else if (req.method === 'GET') {
        // Gérer la récupération des fichiers
        try {
            await client.connect();
            const database = client.db("bourbon");
            const collection = database.collection("files");

            const files = await collection.find({}).toArray();

            return res.status(200).json(files);
        } catch (error) {
            console.error("Error fetching files:", error);
            return res.status(500).json({ error: "Failed to fetch files" });
        } finally {
            await client.close();
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'File ID is missing' });
        }

        try {
            await client.connect();
            const database = client.db("bourbon");
            const collection = database.collection("files");

            // Trouver le fichier dans la base de données
            const file = await collection.findOne({ _id: new MongoClient.ObjectId(id) });
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }

            // Supprimer le fichier du système de fichiers
            const absoluteFilePath = path.join(process.cwd(), 'public', file.filePath);
            await fsPromises.unlink(absoluteFilePath).catch(err => console.error("Error deleting file from disk:", err));

            // Supprimer le document de la base de données
            await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });

            return res.status(200).json({ message: "File deleted successfully" });
        } catch (error) {
            console.error("Error deleting file:", error);
            return res.status(500).json({ error: "Failed to delete the file" });
        } finally {
            await client.close();
        }
    } else if (req.method === 'PUT') {
        const { id, newFileName } = JSON.parse(req.body);
        if (!id || !newFileName) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        try {
            await client.connect();
            const database = client.db("bourbon");
            const collection = database.collection("files");

            // Trouver le fichier dans la base de données
            const file = await collection.findOne({ _id: new MongoClient.ObjectId(id) });
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }

            const oldPath = path.join(process.cwd(), 'public', file.filePath);
            const newStoredFileName = `${newFileName}.pdf`; // Assurez-vous que c'est un PDF
            const newPath = path.join(uploadDir, newStoredFileName);

            // Renommer le fichier sur le système de fichiers
            await fsPromises.rename(oldPath, newPath);

            // Mettre à jour les informations dans la base de données
            await collection.updateOne(
                { _id: new MongoClient.ObjectId(id) },
                { $set: { storedFileName: newStoredFileName, filePath: `/uploads/${newStoredFileName}` } }
            );

            return res.status(200).json({ message: "File renamed successfully", fileUrl: `/uploads/${newStoredFileName}` });
        } catch (error) {
            console.error("Error renaming file:", error);
            return res.status(500).json({ error: "Failed to rename the file" });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
