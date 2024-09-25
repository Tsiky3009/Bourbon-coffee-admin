import style from "./styles/navbar.module.css"
import Link from "next/link"

export default function Navbar(){
    return(
        <>
            <div className={style.navbarBody}>
                <li>
                    <Link href={"/"}>Dashboard</Link>
                    <Link href={"/edito"}>Edito</Link>
                    <Link href={"/partenaires"}>Partenaires</Link>
                    <Link href={"/menu"}>Menu</Link>
                </li>
            </div>
        </>
    )
}