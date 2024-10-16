import { NextApiRequest, NextApiResponse } from "next";
import * as fsPromises from "fs/promises";
import * as fs from "fs";
import path from "path";
import { UPLOAD_DIR } from "@/lib/constants";

export default async function serveFile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { filePath } = req.query;
    const fp = path.join(UPLOAD_DIR, filePath as string);
    const stats = await fsPromises.stat(fp);
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename=${path.basename(filePath as string)}`,
      "Content-Type": "application/pdf", // application/msword
      "Content-Length": stats.size,
    });
    await new Promise(function (resolve) {
      const nodeStream = fs.createReadStream(fp);
      nodeStream.pipe(res);
      nodeStream.on("end", resolve);
    });
  } catch (err) {
    res.writeHead(500, {
      "Content-Type": "application/json", // application/msword
    });
    res.json({ error: "The requested file doesn't exist" });
  }
}
