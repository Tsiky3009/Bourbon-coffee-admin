import { useState, useEffect } from "react";
import DocumentViewer from "@/components/DocumentViewer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Edito() {
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/edito");
      const result = await response.json();
      if (response.status === 500) {
        setFetchError(true);
        return;
      }

      setFiles(result.data);
    } catch (error) {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileURL = URL.createObjectURL(file);
      setFilePreview(
        <DocumentViewer fileUrl={fileURL} local={true} fileType={file.type} />,
      );
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await fetch("/api/edito", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        console.log(result);
        // Handle successful upload (e.g., show success message, refresh file list)
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle upload error (e.g., show error message)
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/edito?id=${id}`, {
        method: "DELETE",
      });
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file);
  };

  const handleSaveEdit = async () => {
    if (editingFile) {
      try {
        await fetch("/api/edito", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingFile._id,
            newFileName: editingFile.fileName,
          }),
        });
        setEditingFile(null);
        fetchFiles(); // Refresh the file list
      } catch (error) {
        console.error("Error updating file:", error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="w-full p-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Editos</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Uploader un fichier</Button>
            </SheetTrigger>
            <SheetContent className="!w-[640px]">
              <SheetHeader>
                <SheetTitle>Uploader un fichier</SheetTitle>
                <SheetDescription>
                  Veuillez séléctionner le ficher
                </SheetDescription>
              </SheetHeader>
              <div className="flex gap-2 my-2">
                <Input type="file" onChange={handleFileChange} />
                {selectedFile && filePreview && (
                  <Button onClick={handleUpload}>Uploader le fichier</Button>
                )}
              </div>
              <div className="max-h-40">
                {error && <p style={{ color: "red" }}>{error}</p>}
                {filePreview}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {isLoading ? (
          <p>Chargement des editos...</p>
        ) : fetchError ? (
          <p>Une erreur s'est produite pendant le chargement des editos...</p>
        ) : (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du fichier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file._id}>
                    <TableCell>
                      {editingFile && editingFile._id === file._id ? (
                        <Input
                          value={editingFile.fileName}
                          onChange={(e) =>
                            setEditingFile({
                              ...editingFile,
                              fileName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        file.fileName
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFile && editingFile._id === file._id ? (
                        <Button onClick={handleSaveEdit}>Renommer</Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => handleEdit(file)}>
                              <Pen className="mr-2 h-4 w-4" />
                              <span>Renommer</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDelete(file._id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
