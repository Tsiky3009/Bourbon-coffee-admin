import { createBlog, getBlog } from "@/lib/blog.service";
import { ShoppingBag } from "lucide-react";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  content: z.string(),
  showOnNavbar: z.boolean(),
});

export default async function handler(req: any, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      const data = await getBlog();
      return res.json(data);
    }

    case "POST": {
      try {
        const parsed = schema.parse(req.body);
        const data = await createBlog(parsed);
        return res.json(data);
      } catch (err) {
        res.json({
          error: "Une erreur est survenue pendant la création du blog",
        });
      }
    }
  }
}
