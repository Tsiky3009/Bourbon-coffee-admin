import { Blog, getBlog } from "@/lib/blog.service";
import NewPostForm from "@/components/NewPostForm";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function BlogPage() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, []);

  async function fetchBlog() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();

      if (data.error) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      setBlogs(data.data);
      setIsLoading(false);
    } catch (err) {}
  }

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
        title: "Succès: Création de l'article",
        description: "L'article a été créé avec succès",
      });
      return;
    }
  }

  async function handleDeleteEdito(_id: any) {
    try {
      const res = await fetch(`/api/blog/${_id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.error) {
        toast({ title: "An error occured", variant: "destructive" });
        return;
      }
      if (result.data) {
        toast({ title: "Blog deleted susccefully" });
      }
    } catch (err) {
      console.error("Error while deleting blog");
    } finally {
      fetchBlog();
    }
  }

  async function showBlogOnNavbar(blog: any) {
    console.log(blog);
    try {
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...blog, showOnNavbar: !blog.showOnNavbar }),
      });
      const result = await res.json();
      if (result.error) {
        toast({ title: "An error occured", variant: "destructive" });
        return;
      }
      if (result.data) {
        toast({ title: "Blog updated susccefully" });
      }
    } catch (err) {
      alert("Error while updating blog");
    } finally {
      fetchBlog();
    }
  }

  return (
    <AdminLayout>
      <div className="w-full h-screen p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Blogs</h1>
          <Button>Ecrire une article</Button>
        </div>
        {isError ? (
          <p className="text-red-500">
            Une erreur s'est produite pendant le chargement des articles
          </p>
        ) : isLoading ? (
          <p>Chargement des articles...</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 mt-4">
            {blogs.map((blog: Blog) => (
              <li key={blog.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <CardDescription>
                      {blog.exerpt ? blog.exerpt : "Description non disponible"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => handleDeleteEdito(blog.id)}>
                      Delete
                    </Button>
                    <div>
                      <Label>Afficher sur l'entête</Label>
                      <Input
                        type="checkbox"
                        checked={blog.showOnNavbar || false}
                        onChange={() => showBlogOnNavbar(blog)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}
