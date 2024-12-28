import { ObjectId } from "mongodb";
import { createEditoBucket } from "../../../lib/edito.service";

export default async function handler(req, res) {
  const bucket = createEditoBucket();
  const { id } = req.query;

  if (req.method === "GET") {
    bucket.openDownloadStream(new ObjectId(id)).pipe(res);
  }

  if (req.method === "POST") {
    const { newFileName } = req.body;
    if (!id || !newFileName) {
      return res.status(400).json({ error: "Missing id or newFileName" });
    }

    try {
      await bucket.rename(new ObjectId(id), newFileName);
      return res.status(200).json({ message: "File renamed successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to rename file" });
    }
  }
  if (req.method === "DELETE") {
    try {
      await bucket.delete(new ObjectId(id));
      return res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to rename file" });
    }
  }
}
