import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: Layers,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

const AdminSidebar = ({ onNavigate }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <aside className="flex flex-col">
      <Link
        to="/admin"
        className="flex items-center gap-3 px-6 py-7"
      >
        <img src={logo} alt="logo" className="w-11" />

        <div>
          <h2 className="text-xl font-semibold">
            Mabel House
          </h2>
          <p className="text-sm text-gray-400">
            Admin Panel
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors ${
                active
                  ? "bg-[#c89b3c] text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;