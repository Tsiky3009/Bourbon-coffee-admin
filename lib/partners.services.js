import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const collection = client.db("bourbon").collection("partenaires");

export async function getPartners() {
  const partners = await collection.find({}).toArray();
  return partners;
}

export async function deletePartner(id) {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}

export async function createPartner(partnerData) {
  return await collection.insertOne(partnerData);
}
