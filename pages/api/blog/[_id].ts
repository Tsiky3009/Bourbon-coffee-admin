import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { _id } = req.query;
  const collection = client.db().collection("blogs");

  switch (req.method) {
    case "DELETE": {
      try {
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

    case "PUT": {
      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(_id as any) },
          {
            $set: JSON.parse(req.body),
          },
        );

        return res.json({ data: result });
      } catch (err) {
        console.log(err);
        res.json({
          error: "Une erreur est survenue pendant la modification du blog",
        });
      }
    }
  }
}
