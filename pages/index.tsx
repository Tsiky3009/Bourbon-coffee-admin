import AdminLayout from "@/components/AdminLayout";
import Navbar from "@/components/navbar";
import style from "@/pages/styles/home.module.css";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { CarTaxiFront } from "lucide-react";

export default function Home() {
  const [countFile, setCountFile] = useState(0)
  const [countPartener,setCountPartener] = useState(0)
  const [activeEdito,setActiveEdito] = useState(null)

  const fetchCountFile = async () =>{
    try {
      const response = await fetch("/api/edito")
      const data = await response.json()
      if (Array.isArray(data.data)) {

        setCountFile(data.data.length)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCountPartener = async () =>{
    try {
      const response = await fetch("/api/partners")
      const data = await response.json()

      if (Array.isArray(data)) {
        setCountPartener(data.length)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchActiveEdito = async () =>{
    try {
      const res = await fetch("/api/edito/active");
      const result = await res.json();

      if(result.error){
        console.log("Failed to get active edito");
      }

      if (result.edito) {
        setActiveEdito(result.edito)
      }

    } catch (error) {
      console.log("Erreur tam active edito",error)
    }
  }



  useEffect(()=>{
    fetchCountFile()
    fetchCountPartener()
    fetchActiveEdito()
  },[])


  return (
    <AdminLayout>
      <div className="p-4 w-full">
        <div className={style.header}></div>
        <h1 className="text-xl font-semibold">Bourbon Coffee Administration</h1>
        <div className={style.card_list}>
            <Card>
              <CardHeader>
                <CardTitle>Nombre d'edito uploadé</CardTitle>
              </CardHeader>
              <CardContent>{countFile}</CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Nombre de partenaire</CardTitle>
              </CardHeader>
              <CardContent>{countPartener}</CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Edito actif</CardTitle>
              </CardHeader>
              <CardContent>{activeEdito ? (
                activeEdito.fileName
                  ) : (
                    <p>Aucun édito actif</p>
                  )}
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
