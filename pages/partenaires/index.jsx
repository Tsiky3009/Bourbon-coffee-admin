import { useState, useEffect } from "react";
import style from "./styles/partenaire.module.css";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pen, Trash, MoreHorizontal } from "lucide-react";

export default function Partenaires() {
  const [nom, setNom] = useState("");
  const [lien, setLien] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [partenaires, setPartenaires] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/partners");
      if (!response.ok) {
        throw new Error("Failed to fetch partenaires");
      }
      const data = await response.json();
      setPartenaires(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedfile = e.target.files[0];
    setFile(selectedfile);

    if (selectedfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedfile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("lien", lien);
    formData.append("description", desc);
    if (file) {
      formData.append("fileupload", file);
    }

    try {
      const url = editingId ? `/api/partners?id=${editingId}` : "/api/partners";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      // Clear form fields
      setNom("");
      setLien("");
      setDesc("");
      setFile(null);
      setPreview(null);
      setEditingId(null);

      // Refresh the list of partenaires
      await fetchPartenaires();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this partenaire?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/partners?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete partenaire");
        }
        await fetchPartenaires();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (partenaire) => {
    setEditingId(partenaire._id);
    setNom(partenaire.nom);
    setLien(partenaire.lien);
    setDesc(partenaire.description);
    setPreview(null); // Reset preview as we don't have the image URL
  };

  return (
    <AdminLayout>
      <div className="flex w-full justify-between gap-4 p-4">
        <div className="w-full">
          {isLoading ? (
            <p>Chargement des partenaires...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Lien</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partenaires.map((partenaire, index) => (
                  <TableRow key={partenaire._id || index}>
                    <TableCell>{partenaire.nom}</TableCell>
                    <TableCell>{partenaire.lien}</TableCell>
                    <TableCell>{partenaire.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem
                            onClick={() => handleEdit(partenaire)}
                          >
                            <Pen className="mr-2 h-4 w-4" />
                            <span>Renommer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDelete(partenaire._id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div class="w-full">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="fileupload">Logo</Label>
              <Input
                type="file"
                name="fileupload"
                id="fileupload"
                onChange={handleFileChange}
              />
              {preview && (
                <div>
                  <p>Image Preview:</p>
                  <img
                    src={preview}
                    alt="Image preview"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="id_nom">Nom</Label>
              <Input
                type="text"
                id="id_nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="id_lien">Lien</Label>
              <Input
                type="text"
                id="id_lien"
                value={lien}
                onChange={(e) => setLien(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="id_desc">Descriptions</Label>
              <Textarea
                name="input_desc"
                id="id_desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></Textarea>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : editingId
                  ? "Mettre à jour"
                  : "Enregistrer"}
            </Button>
          </form>
          {error && <p className={style.error}>{error}</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
