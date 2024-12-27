import formidable from "formidable";
import { promises as fsPromises } from "fs";
import { ObjectId } from "mongodb";
import client from "@/lib/mongodb";
import { UPLOAD_DIR } from "@/lib/constants";
import path from "path";
import {
  createEditoBucket,
  retrieveFiles,
  uploadFile,
} from "../../lib/edito.service";

// Désactive le bodyParser de Next.js pour gérer les fichiers
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  let collection = client.db().collection("files");

  if (req.method === "POST") {
    let form = formidable({});
    try {
      let [fields, files] = await form.parse(req);

      if (!files.file || !files.file[0]) {
        return res
          .status(400)
          .json({ message: "No file found. Please provide a file" });
      }

      await uploadFile(files.file[0]);
      return res.status(200).json({ message: "File uploaded" });
    } catch (error) {
      return res.status(400).json({ message: "Failed to parse form" });
    }
  }

  if (req.method === "GET") {
    try {
      const editos = await retrieveFiles();
      return res.status(200).json({ data: editos });
    } catch (error) {
      console.error("Error fetching files:", error);
      return res.status(500).json({ error: "Failed to fetch files" });
    }
  }

  // res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
  // return res.status(405).end(`Method ${req.method} Not Allowed`);
}
