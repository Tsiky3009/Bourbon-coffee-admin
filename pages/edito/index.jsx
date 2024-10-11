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
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/AdminLayout";

export default function Edito() {
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/edito");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
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
      <div className="flex justify-between gap-4 w-full p-2">
        <div className="w-full">
          <h1 className="font-semibold text-lg mt-2">Mes editos</h1>
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
        <div className="w-full bg-[#171717] p-2 rounded-md">
          <h2 className="mb-2 font-semibold text-lg">Uploader un edito</h2>
          <Label>Veuillez séléctionner le fichier</Label>
          <div className="flex gap-2 mb-2">
            <Input type="file" onChange={handleFileChange} />
            {selectedFile && filePreview && (
              <Button onClick={handleUpload}>Uploader le fichier</Button>
            )}
          </div>
          <div className="max-h-40">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {filePreview}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
