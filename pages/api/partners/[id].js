import { GridFSBucket, ObjectId } from "mongodb";
import client from "../../../lib/mongodb";
import { formidable } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const bucket = new GridFSBucket(client.db(), {
    bucketName: "partners",
  });
  const { id } = req.query;

  if (req.method === "GET") {
    bucket.openDownloadStream(new ObjectId(id)).pipe(res);
  }

  if (req.method === "PUT") {
    const form = formidable();

    const [fields, files] = await form.parse(req);

    const metadataIsComplete =
      fields["name"] &&
      fields["website"] &&
      fields["description"] &&
      fields["name"][0] &&
      fields["website"][0] &&
      fields["description"][0];
    // const logo = files && files.logo ? files.logo[0] : null;

    if (!metadataIsComplete) {
      return res.status(400).json({ message: "Incomplete body" });
    }

    const newMetadata = {
      name: fields["name"][0],
      description: fields["description"][0],
      website: fields["website"][0],
    };

    try {
      const doc = await client
        .db()
        .collection("partners.files")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { metadata: newMetadata } },
        );
      return res.json(doc);
    } catch (error) {
      console.error(error);
    }
  }
}
