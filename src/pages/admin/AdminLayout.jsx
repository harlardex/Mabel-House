import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="h-15" />
      <aside className="fixed top-15 left-0 h-screen w-64 overflow-y-auto">
        <AdminSidebar />
      </aside>

      <main className="ml-64 min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;