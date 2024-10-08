// import style from "./styles/navbar.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen transition-all duration-300 ease-in-out">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <nav className="mt-4">
        <Link href={"/"}>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
          >
            Dashboard
          </Button>
        </Link>
        <Link href={"/edito"}>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
          >
            Edito
          </Button>
        </Link>
        <Link href="partenaires">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
          >
            Partenaires
          </Button>
        </Link>
        <Link href="blog">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
          >
            Blog
          </Button>
        </Link>
      </nav>
    </aside>
  );
}
