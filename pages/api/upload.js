import formidable from "formidable";
import fs from "fs";
import path from 'path';
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("bourbon");
    const collection = db.collection("partenaires");

    switch (req.method) {
        case 'GET':
            try {
                const partenaires = await collection.find({}).toArray();
                res.status(200).json(partenaires);
            } catch (error) {
                console.error('Error fetching partenaires:', error);
                res.status(500).json({ error: 'Error fetching data from database' });
            }
            break;

        case 'POST':
        case 'PUT':
            const form = formidable({
                maxFileSize: Infinity,
                keepExtensions: true,
            });

            const uploadDir = path.join(process.cwd(), '/public/uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            form.uploadDir = uploadDir;
            form.keepExtensions = true;

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error parsing the form' });
                }

                const { id_nom, id_lien, input_desc } = fields;
                const file = files.fileupload;

                try {
                    let updateData = {
                        nom: id_nom,
                        lien: id_lien,
                        description: input_desc,
                    };

                    if (file) {
                        updateData.fileName = file.newFilename;
                    }

                    if (req.method === 'PUT') {
                        const { id } = req.query;
                        const result = await collection.updateOne(
                            { _id: new ObjectId(id) },
                            { $set: updateData }
                        );
                        res.status(200).json({ message: 'Partenaire updated successfully', result });
                    } else {
                        updateData.uploadDate = new Date();
                        const result = await collection.insertOne(updateData);
                        res.status(200).json({ message: 'Partenaire added successfully', insertedId: result.insertedId });
                    }
                } catch (error) {
                    console.error('Error saving to MongoDB:', error);
                    res.status(500).json({ error: 'Error saving to database' });
                }
            });
            break;

        case 'DELETE':
            try {
                const { id } = req.query;
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Partenaire deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Partenaire not found' });
                }
            } catch (error) {
                console.error('Error deleting partenaire:', error);
                res.status(500).json({ error: 'Error deleting from database' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}