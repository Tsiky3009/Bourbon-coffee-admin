import formidable from "formidable";
import { retrieveFiles, uploadFile } from "../../lib/edito.service";

// Use formidable parse instead
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    let form = formidable({});
    try {
      let [_fields, files] = await form.parse(req);

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
}
