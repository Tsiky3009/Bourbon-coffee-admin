import { getBlog } from "@/lib/blog.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const blogs = await getBlog();
  return res.json(blogs);
}
