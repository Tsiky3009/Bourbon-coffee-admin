import client from "@/lib/mongodb";
import { Document, InsertOneResult, WithId } from "mongodb";

export type Blog = {
  id?: any;
  title: string;
  content: string;
};

function blogBuilder(data: WithId<Document>): Blog {
  return {
    id: data._id.toString(),
    title: data.title,
    content: data.content,
  };
}

export async function getBlog() {
  try {
    const blogCollection = client.db().collection("blogs");
    const data = await blogCollection.find().toArray();

    const blogs: Blog[] = [];
    data.forEach((d) => {
      blogs.push(blogBuilder(d));
    });
    return { data: blogs };
  } catch (err) {
    return { error: "Database connection error" };
  }
}

export async function createBlog(blog: Blog) {
  try {
    const blogCollection = client.db().collection("blogs");
    await blogCollection.insertOne(blog);
    return { data: blog };
  } catch (err) {
    return { error: "Database connection error" };
  }
}
