// pages/edito/index.jsx
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import style from "./styles/edito.module.css";
import Delete from "../../public/trash.png";
import Edit from "../../public/pencil.png";
import Image from "next/image";
import DocumentViewer from "@/components/DocumentViewer";

export default function Edito() {
    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [editingFile, setEditingFile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/file-upload');
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des fichiers :", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const fileURL = URL.createObjectURL(file);
            setFilePreview(
                <DocumentViewer 
                    fileUrl={fileURL} 
                    local={true}
                    fileType={file.type}
                />
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
                const res = await fetch("/api/file-upload", {
                    method: 'POST',
                    body: formData,
                });
                const result = await res.json();
                console.log(result);
                if (result.fileUrl) {
                    setFilePreview(
                        <DocumentViewer 
                            fileUrl={result.fileUrl} 
                            local={false}
                            fileType="application/pdf"
                        />
                    );
                    fetchFiles(); // Rafraîchir la liste des fichiers
                }
            } catch (error) {
                console.error("Erreur lors de l'upload :", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/file-upload?id=${id}`, {
                method: 'DELETE',
            });
            fetchFiles(); // Rafraîchir la liste des fichiers
        } catch (error) {
            console.error("Erreur lors de la suppression du fichier :", error);
        }
    };

    const handleEdit = (file) => {
        setEditingFile(file);
    };

    const handleSaveEdit = async () => {
        if (editingFile) {
            try {
                await fetch('/api/file-upload', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: editingFile._id,
                        newFileName: editingFile.fileName,
                    }),
                });
                setEditingFile(null);
                fetchFiles(); // Rafraîchir la liste des fichiers
            } catch (error) {
                console.error("Erreur lors de la mise à jour du fichier :", error);
            }
        }
    };

    return (
        <>
            <div className={style.body}>
                <div className={style.column_1}>
                    <Navbar/>
                </div>
                <div className={style.column_2}>
                    <div className={style.form}>
                        <input type="file" name="fileupload" onChange={handleFileChange}/>
                        <div className={style.file_preview}>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            {filePreview}
                        </div>
                        <button onClick={handleUpload}>Upload file</button>
                    </div>
                    <div className={style.list}>
                        <table className={style.list_file}>
                            <thead>
                                <tr className={style.t_head}>
                                    <td>Nom</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file) => (
                                    <tr key={file._id}>
                                        <td>
                                            {editingFile && editingFile._id === file._id ? (
                                                <input 
                                                    value={editingFile.fileName}
                                                    onChange={(e) => setEditingFile({...editingFile, fileName: e.target.value})}
                                                />
                                            ) : (
                                                file.originalFileName
                                            )}
                                        </td>
                                        <td>
                                            <div className={style.delete} onClick={() => handleDelete(file._id)}>
                                                <Image src={Delete} width={20} height={20} alt="delete_icon"/>
                                            </div>
                                        </td>
                                        <td>
                                            {editingFile && editingFile._id === file._id ? (
                                                <button onClick={handleSaveEdit}>Save</button>
                                            ) : (
                                                <div className={style.edit} onClick={() => handleEdit(file)}>
                                                    <Image src={Edit} width={20} height={20} alt="edit_icon"/>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>  
        </>
    )
}
