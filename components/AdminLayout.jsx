import Navbar from "@/components/navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="w-full h-screen overflow-hidden flex">
      <Navbar />
      {children}
    </div>
  );
}
