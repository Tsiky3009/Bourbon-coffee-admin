import AdminLayout from "@/components/AdminLayout";
import Navbar from "@/components/navbar";
import style from "@/pages/styles/home.module.css";

export default function Home() {
  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-xl font-semibold">Bourbon Coffee Administration</h1>
      </div>
    </AdminLayout>
  );
}
