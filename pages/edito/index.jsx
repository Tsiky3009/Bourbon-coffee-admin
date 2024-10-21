import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import style from "./styles/edito.module.css"
import Delete from "../../public/trash.png"
import Edit from "../../public/pencil.png"
import Image from "next/image"
import DocumentViewer from "@/components/DocumentViewer";
import Succes from "@/public/succes.png"
import Warning from "@/public/avertissement.png"

export default function Edito() {
    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const [files, setFiles] = useState([]);
    const [editingFile, setEditingFile] = useState(null);
    const [error, setError] = useState(null);
    const [succes, setSucces] = useState(false)
    const [del, setDelete] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [succesDel, setSuccesDel] = useState(false)


    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/file-upload');
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
        // Handle successful upload (e.g., show success message, refresh file list)

        //Upload succesful
        setSucces(true)
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle upload error (e.g., show error message)
      }
    }
  };



    const handleConfirmeDelete = async () => {
        try {
            await fetch(`/api/file-upload?id=${fileToDelete}`, {
                method: 'DELETE',
              });

            fetchFiles(); // Refresh the file list
            setDelete(false)
            setFileToDelete(null)
            setSuccesDel(true)
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }

    const handleDelete = (id) => {
        setFileToDelete(id)
        setDelete(true)
    }

    const handleEdit = (file) => {
        setEditingFile(file);
    }

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
                fetchFiles(); // Refresh the file list
            } catch (error) {
                console.error("Error updating file:", error);
            }
        }
    }

    return (
        <>
            <div className={style.body}>
                <div className={style.column_1}>
                    <Navbar/>
                </div>
                <div className={style.column_2}>
                    <div className={style.form}>
                        <input type="file" name="file" onChange={handleFileChange}/>
                        <div className={style.file_preview}>
                            {/*{filePreview}*/}
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
                                </tr>
                            </thead>
                            <tbody className={style.scrollable_body}>
                                {files.map((file) => (
                                    <tr key={file._id}>
                                        <td className={style.file_name}>
                                            {editingFile && editingFile._id === file._id ? (
                                                <input 
                                                    value={editingFile.fileName}
                                                    onChange={(e) => setEditingFile({...editingFile, fileName: e.target.value})}
                                                />
                                            ) : (
                                                file.fileName
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

            {/*Succes modal*/}
            {succes && (
                <div className={style.modal}>
                    <div className={style.modal_content}>
                        <div className={style.modal_title}>
                            <h1>Succès</h1>
                        </div>
                        <div className={style.modal_body}>
                            <p>Le fichier a été téléchargé avec succès !</p>
                            <div className={style.logo_succes}>
                                <Image 
                                    src={Succes}
                                    alt="icone succes"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <button
                                onClick={() => {
                                setSucces(false); // Fermer le modal
                                fetchFiles(); // Recharger la liste des fichiers
                                }}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*Warning modal on delete */}
            {del && (
                <div className={style.modal}>
                    <div className={style.modal_content}>
                        <div className={style.modal_title}>
                            <h1>Confirmation de suppression</h1>
                        </div>
                        <div className={style.modal_body}>
                            <p>Es-tu sûr de vouloir supprimer ce fichier ?</p>
                            <div className={style.logo_succes}>
                                <Image 
                                    src={Warning}
                                    alt="icone warning"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className={style.modal_button_list}>
                                <button onClick={handleConfirmeDelete}>Confirmer</button>
                                <button onClick={() => setDelete(false)}>Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*Succes delete modal*/}
            {succesDel && (
                <div className={style.modal}>
                    <div className={style.modal_content}>
                        <div className={style.modal_title}>
                            <h1>Succès</h1>
                        </div>
                        <div className={style.modal_body}>
                            <p>Le fichier a été bien supprimer</p>
                            <div className={style.logo_succes}>
                                <Image 
                                    src={Succes}
                                    alt="icone succes"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <button onClick={() => setSuccesDel(false)}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}