import AdminLayout from "@/components/AdminLayout";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export default function NewBlogPage() {
  const [blog, setBlog] = useState({
    title: "Nouvel article",
    content: "Contenu",
  });

  return (
    <AdminLayout>
      <div className="w-full p-4">
        {/*Header*/}
        <div className="flex w-full justify-between items-center">
          <h1 className="text-2xl font-semibold">Ecrire un article</h1>
          <div className="flex gap-4">
            <Button variant={"secondary"}>Annuler</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Publier ou sauvegarder</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Publier</DropdownMenuItem>
                <DropdownMenuItem>Sauvegarder</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/*Edito*/}
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex flex-col gap-4">
            <Label>Titre</Label>
            <Input
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            />
          </div>
          <Editor
            blogContent={blog.content}
            handleChange={(md) => {
              setBlog({ ...blog, content: md });
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
