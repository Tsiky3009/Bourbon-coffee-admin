import client from "@/lib/mongodb";
import { GridFSBucket } from "mongodb";
import fs from "fs";

export function createEditoBucket() {
  const db = client.db();
  return new GridFSBucket(db, { bucketName: "editos" });
}

/**
 * This function uploads the file to mongodb
 * For more information check this link: https://www.mongodb.com/docs/drivers/node/current/fundamentals/gridfs/
 */

export async function uploadFile(file) {
  const bucket = createEditoBucket();
  console.log(file);

  // const file = bucket.find({ filename: { $eq: filename } }).limit(1);

  // if (!(await file.hasNext())) {
  //   return "File already exist!";
  // }

  // upload the file to mongodb
  fs.createReadStream(file.filepath).pipe(
    bucket.openUploadStream(file.originalFilename),
  );
}

export async function retrieveFiles() {
  const bucket = createEditoBucket();

  return await bucket.find({}).toArray();
}
