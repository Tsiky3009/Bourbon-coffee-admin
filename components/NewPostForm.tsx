import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Editor from "./Editor";
import { Blog } from "@/lib/blog.service";

type Props = {
  handleResponse: any;
};

export default function NewPostForm({ handleResponse }: Props) {
  const [blog, setBlog] = useState<Blog>({
    title: "Titre du blog",
    content: "",
    showOnNavbar: false,
  });

  async function createPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blog),
    });

    const data = await res.json();
    handleResponse(data);
  }

  const handleChange = (md: string) => {
    setBlog({ ...blog, content: md });
  };

  return (
    <form
      onSubmit={createPost}
      className="w-[56rem] mx-auto p-4 bg-white rounded-sm"
    >
      <Label htmlFor="title" className="mb-1">
        Titre
      </Label>
      <Input
        name="title"
        id="title"
        required
        className="mb-2"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
      />
      <Label htmlFor="content" className="mb-1">
        Contenue
      </Label>
      <Editor blogTitle={blog.title} handleChange={handleChange} />
      {/*<Input name="content" id="content" required className="mb-2" />*/}
      <Button type="submit">Poster</Button>
    </form>
  );
}
