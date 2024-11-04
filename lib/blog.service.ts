import client from "@/lib/mongodb";
import { Document, WithId } from "mongodb";
import slug from "slug";

export type Blog = {
  id?: any;
  title: string;
  exerpt?: string;
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
    await blogCollection.insertOne({ ...blog, slug: slug(blog.title) });
    return { data: blog };
  } catch (err) {
    return { error: "Database connection error" };
  }
}
