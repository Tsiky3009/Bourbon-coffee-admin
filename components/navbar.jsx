// import style from "./styles/navbar.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <aside className="bg-[#18181b] text-white min-w-56 w-56 max-w-56 min-h-screen transition-all duration-300 ease-in-out">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Bourbon Coffee</h1>
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
            Editos
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
            Articles
          </Button>
        </Link>
      </nav>
    </aside>
  );
}
