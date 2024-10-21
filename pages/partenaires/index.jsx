import { useState, useEffect } from "react"
import Navbar from "../../components/navbar"
import style from "./styles/partenaire.module.css" 
import Image from "next/image"
import Delete from "../../public/trash.png"
import Edit from "../../public/pencil.png"
import Succes from "@/public/succes.png"
import Warning from "@/public/avertissement.png"

export default function Partenaires(){
    const [nom, setNom] = useState('')
    const [lien, setLien] = useState('')
    const [desc, setDesc] = useState('')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [partenaires, setPartenaires] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [succes, setSucces] = useState(false)
    const [del, setDelete] = useState(false);
    const [partenerToDelete, setPartenerToDelete] = useState(null);
    const [succesDel, setSuccesDel] = useState(false)

    useEffect(() => {
        fetchPartenaires()
    }, [])

    const fetchPartenaires = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/upload')
            if (!response.ok) {
                throw new Error('Failed to fetch partenaires')
            }
            const data = await response.json()
            setPartenaires(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = (e) => {
        const selectedfile = e.target.files[0];
        setFile(selectedfile)

        if(selectedfile){
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(selectedfile)
        } else {
            setPreview(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setError(null)

        const formData = new FormData();
        formData.append('id_nom', nom);
        formData.append('id_lien', lien);
        formData.append('input_desc', desc);
        if (file) {
            formData.append('fileupload', file)
        }

        try {
            const url = editingId ? `/api/upload?id=${editingId}` : '/api/upload';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData,
            })
            
            if (!response.ok) {
                throw new Error('Failed to submit the form')
            }

            const result = await response.json()
            console.log('Form submitted successfully:', result);
            
            // Clear form fields
            setNom('')
            setLien('')
            setDesc('')
            setFile(null)
            setPreview(null)
            setEditingId(null)
            setSucces(true)

            // Refresh the list of partenaires
            await fetchPartenaires()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = (id) => {
        setPartenerToDelete(id);
        setDelete(true); // Show the warning modal
    };

    const handleConfirmeDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/upload?id=${partenerToDelete}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete partenaire');
            }
            await fetchPartenaires();
            setSuccesDel(true); // Show success modal
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setDelete(false); // Close warning modal
        }
    };

    const handleEdit = (partenaire) => {
        setEditingId(partenaire._id)
        setNom(partenaire.nom)
        setLien(partenaire.lien)
        setDesc(partenaire.description)
        setPreview(null) // Reset preview as we don't have the image URL
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
                            
                            <input type="file" name="fileupload" id="fileupload" onChange={handleFileChange}/>

                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Enregistrer')}
                            </button>
                        </form>
                        {error && <p className={style.error}>{error}</p>}
                    </div>
                    <div className={style.list}>
                        {isLoading ? (
                            <p>Chargement des partenaires...</p>
                        ) : (
                            <table className={style.list_partenaire}>
                                <thead>
                                    <tr className={style.t_head}>
                                        <th>Nom</th>
                                        <th>Lien</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partenaires.map((partenaire, index) => (
                                        <tr className={style.items} key={partenaire._id || index}>
                                            <td>{partenaire.nom}</td>
                                            <td>{partenaire.lien}</td>
                                            <td>{partenaire.description}</td>
                                            <td className={style.action}>
                                                <button onClick={() => handleDelete(partenaire._id)} className={style.delete}>
                                                    <Image src={Delete} width={20} height={20} alt="delete_icon"/>
                                                </button>
                                                <button onClick={() => handleEdit(partenaire)} className={style.edit}>
                                                    <Image src={Edit} width={20} height={20} alt="edit_icon"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
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
                            <p>Le partenaire a été téléchargé avec succès !</p>
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
                                fetchPartenaires(); // Recharger la liste des fichiers
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
                            <p>Es-tu sûr de vouloir supprimer cette partenaire ?</p>
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
                            <p>Le partenaire a été bien supprimer</p>
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