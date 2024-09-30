import { useState } from "react"
import Navbar from "../../components/navbar"
import style from "./styles/partenaire.module.css" 
import { redirect } from "next/dist/server/api-utils"
import Delete from "../../public/trash.png"
import Edit from "../../public/pencil.png"
import Image from "next/image"

export default function Partenaires(){

    const [nom,setNom] = useState('')
    const [lien,setLien] = useState('')
    const [desc,setDesc] =useState('')
    const [file,setFile] = useState(null)
    const [preview,setPreview] = useState(null)

    const data = [
        { name: "Cirad"},
        { name: "Groupama"},
        { name: "Ambassade de france"},
    ];


    const handleFileChange = (e) =>{
        const selectedfile = e.target.files[0];
        setFile(selectedfile)

        // Create a preview URL
        if(selectedfile){
            const reader = new FileReader()

            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(selectedfile)
        }else{
            selectedfile(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('id_nom',nom);
        formData.append('id_lien',lien);
        formData.append('input_desc',desc);
        formData.append('fileupload',file)

        try {
            const response = await fetch('api/upload', {
                method:'POST',
                body:formData,
            })
            console.log(formData)
            console.log(response)
            if (response.ok) {
                console.log('Form submitted successfully!');
            }else{
                console.error('Failed to submit the form.');
            }


        } catch (error) {
            console.error('Error submitting the form:', error);
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
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <label htmlFor="id_nom">Nom</label>
                            <input type="text" id="id_nom" value={nom} onChange={(e) => setNom(e.target.value)}/>

                            <label htmlFor="id_lien">Lien</label>
                            <input type="text" id="id_lien" value={lien} onChange={(e)=> setLien(e.target.value)}/>

                            <label htmlFor="id_desc">Descriptions</label>

                            <textarea name="input_desc" id="id_desc" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>

                            {preview && (
                                <div>
                                    <p>Image Preview:</p>
                                    <img src={preview} alt="Image preview" style={{ width: '200px', height: 'auto' }} />
                                </div>
                            )}
                            
                            <input type="file" name="fileupload" id="" onChange={handleFileChange}/>

                            <button type="submit">Enregister</button>
                        </form>
                    </div>
                    <div className={style.list}>
                        <table className={style.list_partenaire}>
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