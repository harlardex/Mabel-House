import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between bg-white px-4 shadow md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded p-2 hover:bg-gray-100"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <span className="font-semibold">Admin Dashboard</span>
      </div>

      <aside className={`
          fixed left-0 z-40 h-screen w-64 bg-[#151b20] text-white shadow-lg
          transition-transform duration-300
          top-14 md:top-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="pt-14 md:ml-64 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;