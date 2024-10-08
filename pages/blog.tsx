import { Blog, getBlog } from "@/lib/blog.service";
import { InferGetStaticPropsType } from "next";
import NewPostForm from "@/components/NewPostForm";
import { useToast } from "@/hooks/use-toast";

export default function BlogPage({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { toast } = useToast();

  function handleResponse(data: any) {
    if (data.error) {
      toast({
        title: "Erreur",
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    if (data.data) {
      toast({
        title: "Succès: Création du blog",
        description: "Le blog a été créé avec succès",
      });
      return;
    }
  }
  return (
    <div className="bg-white-800 h-screen">
      <NewPostForm handleResponse={handleResponse} />
      {blogs.error ? (
        <p>{blogs.error}</p>
      ) : (
        <ul>
          {blogs.data!.map((blog: Blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      )}
    </div>
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
