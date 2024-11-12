import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "DELETE": {
      try {
        const { _id } = req.query;
        const collection = client.db().collection("blogs");

        const result = await collection.deleteOne({
          _id: new ObjectId(_id as any),
        });
        return res.json({ data: result });
      } catch (err) {
        res.json({
          error: "Une erreur est survenue pendant la suppression du blog",
        });
      }
    }
  }
}
