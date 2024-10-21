import style from "./styles/navbar.module.css"
import Link from "next/link"
import Image from "next/image"
import User from "@/public/user.png"
import Logo from "@/public/Logo_ONG_ACACIA-removebg-preview.png"

export default function Navbar(){
    return(
        <>
            <div className={style.navbarBody}>
                <div className={style.logo}>
                    <Image
                        src={Logo}
                        alt="logo acacia"
                        width={60}
                        height={60}
                    />
                </div>
                <li>
                    <Link href={"/"}>Dashboard</Link>
                    <Link href={"/edito"}>Edito</Link>
                    <Link href={"/partenaires"}>Partenaires</Link>
                    <Link href={"/menu"}>Menu</Link>
                </li>
                <div className={style.icon_user}>
                    <div className={style.im_user}>
                        <Image
                            src={User}
                            alt="user image"
                            width={50}
                            height={50}
                        />
                    </div>
                    <div className={style.user_name}>
                        <p>User</p>
                    </div>
                </div>
            </div>
        </>
    )
}