import client from "@/lib/mongodb";
import { Document, WithId } from "mongodb";

export type Blog = {
  id: any;
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

export async function getBlog(): Promise<Blog[]> {
  const blogCollection = client.db().collection("blogs");
  const data = await blogCollection.find().toArray();

  const blogs: Blog[] = [];
  data.forEach((d) => {
    blogs.push(blogBuilder(d));
  });
  return blogs;
}
