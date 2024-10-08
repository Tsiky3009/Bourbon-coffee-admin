import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveFiles, uploadFile } from "@/lib/edito.service";
import { readdir } from "fs/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET": {
      // const cursor = await retrieveFiles();
      // const files = await cursor.toArray();
      // return res.json(files);
      const files = await readdir("./uploads");
      return res.json(files);
    }

    case "POST": {
      try {
        await uploadFile();
        return res.status(200).json({ Hi: "World" });
      } catch (e) {
        return res.status(400).json({ error: "File already exist" });
      }
    }
  }
}
