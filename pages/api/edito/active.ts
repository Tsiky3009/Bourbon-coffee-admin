import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const collection = client.db().collection("activeEdito");
  if (req.method === "GET") {
    try {
      const currentActiveEdito = await collection.findOne();
      if (currentActiveEdito === null) {
        return res.json({ error: "No active edito" });
      }
      const edito = await client
        .db()
        .collection("files")
        .findOne({ _id: new ObjectId(currentActiveEdito.editoId) });
      console.log(edito);
      return res.json({ editoId: currentActiveEdito.editoId, edito });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  if (req.method === "POST") {
    try {
      const { editoId } = JSON.parse(req.body);
      const currentActiveEdito = await collection.findOne();
      if (currentActiveEdito) {
        const updateDocument = {
          $set: {
            editoId: editoId,
          },
        };
        const result = await collection.updateOne(
          { _id: currentActiveEdito._id },
          updateDocument,
        );
        if (result.modifiedCount === 1) {
          return res.json({ editoId });
        } else {
          return res.json({ editoId: null });
        }
      } else {
        const result = await collection.insertOne({ editoId });
        if (result.insertedId !== null) {
          return res.json({ editoId });
        } else {
          return res.json({ editoId: null });
        }
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
