import client from "@/lib/mongodb";
import { GridFSBucket } from "mongodb";
import fs from "fs";

function createGridFSBucket() {
  const db = client.db();
  console.log(db.databaseName);
  return new GridFSBucket(db);
}

/**
 * This function uploads the file to mongodb
 * For more information check this link: https://www.mongodb.com/docs/drivers/node/current/fundamentals/gridfs/
 */

export async function uploadFile(filepath?: string) {
  const bucket = createGridFSBucket();

  const files = await bucket.find({ filename: { $eq: "test.md" } }).toArray();
  console.log(files);

  if (files.length !== 0) {
    throw new Error("File already exist");
  }

  fs.createReadStream("./test.md").pipe(
    bucket.openUploadStream("test.md", {
      chunkSizeBytes: 1048576,
      metadata: { field: "name", value: "test.md" },
    }),
  );
}

export async function retrieveFiles() {
  const bucket = createGridFSBucket();

  return bucket.find({});
}