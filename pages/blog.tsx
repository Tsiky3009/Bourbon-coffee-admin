import { Blog, getBlog } from "@/lib/blog.service";
import { InferGetStaticPropsType } from "next";

export default function BlogPage({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ul>
      {blogs.map((blog: Blog) => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const blogs = await getBlog();

  return {
    props: {
      blogs,
    },
  };
}
