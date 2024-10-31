import formidable from "formidable";
import fs from "fs";
import path from "path";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  createPartner,
  deletePartner,
  getPartners,
} from "../../lib/partners.services";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const db = client.db("bourbon");
  const collection = db.collection("partenaires");

  switch (req.method) {
    case "GET": {
      try {
        const data = await getPartners();
        return res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching partenaires:", error);
        return res
          .status(500)
          .json({ error: "Error fetching data from database" });
      }
    }

    case "POST":
    case "PUT": {
      const form = buildForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: "Error parsing the form" });
        }

        if (!fields["name"] || !fields["link"] || !fields["description"]) {
          return res.json({ error: "Incomplete body" });
        }

        const file = files ? files.fileupload[0] : null;

        try {
          let partnerData = {
            name: fields["name"][0],
            link: fields["link"][0],
            description: fields["description"][0],
          };

          if (file) {
            partnerData.fileName = file.newFilename;
          }

          if (req.method === "PUT") {
            const { id } = req.query;
            const result = await collection.updateOne(
              { _id: new ObjectId(id) },
              { $set: partnerData },
            );
            return res
              .status(200)
              .json({ message: "Partenaire updated successfully", result });
          }

          // IF POST
          partnerData.uploadDate = new Date();
          const result = await createPartner(partnerData);
          return res.status(200).json({
            message: "Partenaire added successfully",
            insertedId: result.insertedId,
          });
        } catch (error) {
          console.error("Error saving to MongoDB:", error);
          return res.status(500).json({ error: "Error saving to database" });
        }
      });
    }

    case "DELETE": {
      try {
        const { id } = req.query;
        const result = await deletePartner(id);

        const partner = await collection.findOne({ _id: new ObjectId(id) });

        const fileExists =
          (await fsPromises.readdir(UPLOAD_DIR)).filter(
            (f) => f === partner.fileName,
          ).length === 1;

        if (fileExists) {
          // delete the associated file
          await fsPromises.unlink(path.join(UPLOAD_DIR, partner.fileName));
        }

        if (result.deletedCount === 1) {
          return res
            .status(200)
            .json({ message: "Partenaire deleted successfully" });
        }
        return res.status(404).json({ error: "Partenaire not found" });
      } catch (error) {
        console.error("Error deleting partenaire:", error);
        res.status(500).json({ error: "Error deleting from database" });
      }
    }

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}

function buildForm() {
  const form = formidable({
    maxFileSize: Infinity,
    keepExtensions: true,
  });

  const uploadDir = path.join(process.cwd(), "/public/file_uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  return form;
}
