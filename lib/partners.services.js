import client from "@/lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";
import fs from "fs";

const partnersBucket = new GridFSBucket(client.db(), {
  bucketName: "partners",
});

export async function createPartner(partnerImage, partnerData) {
  fs.createReadStream(partnerImage.filepath).pipe(
    partnersBucket.openUploadStream(partnerImage.originalFilename, {
      metadata: {
        name: partnerData.name,
        description: partnerData.description,
        website: partnerData.website,
      },
    }),
  );
}

export async function getPartners() {
  return await partnersBucket.find().toArray();
}

export async function deletePartner(id) {
  await partnersBucket.delete(new ObjectId(id));
}
