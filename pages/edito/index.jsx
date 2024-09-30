import { useState } from "react"
import Navbar from "@/components/navbar"
import style from "./styles/edito.module.css"
import Delete from "../../public/trash.png"
import Edit from "../../public/pencil.png"
import Image from "next/image"
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
//import { read } from "fs"

export default function Edito() {

    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const data = [
        { name: "Cirad"},
        { name: "Groupama"},
        { name: "Ambassade de france"},
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
      
        setSelectedFile(file);
      
        if (file) {
            const fileURL = URL.createObjectURL(file);
      
            if (file.name.endsWith(".docx") || file.name.endsWith(".pdf")) {
              setFilePreview([{ uri: fileURL }]);
            } else if (file.type.startsWith("image/")) {
              setFilePreview(<img src={fileURL} alt="preview" width={200} />);
            } else {
              setFilePreview(<p>{file.name}</p>);
            }
          } else {
            setFilePreview(null);
        }
    };
      

    
    const handleUpload = async() =>{
        if(selectedFile){
            const formData = new FormData()

            formData.append("file",selectedFile)

            const res = await fetch("/api/file.upload", {
                method: 'POST',
                body: formData,
            })

            const result = await res.json()

            console.log(result)
        }
    }
    return(
        <>
            <div className={style.body}>
                <div className={style.column_1}>
                    <Navbar/>
                </div>
                <div className={style.column_2}>
                    <div className={style.form}>
                        <input type="file" name="fileupload" id="" onChange={handleFileChange}/>
                        <div className={style.file_preview}>
                            {filePreview && typeof filePreview === "object" ? (
                                <DocViewer
                                documents={filePreview}
                                pluginRenderers={DocViewerRenderers}
                                />
                            ) : (
                                filePreview
                            )}
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
                                {data.map((row,index)=>
                                    <tr key={index}>
                                        <td>{row.name}</td>
                                        <td>
                                            <div className={style.delete}>
                                                <Image src={Delete} width={20} height={20} alt="delete_icon"/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={style.edit}>
                                                <Image src={Edit} width={20} height={20} alt="edit_icon"/>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>  
        </>
    )
}