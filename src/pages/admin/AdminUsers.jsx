
import { useMemo, useState, useCallback, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import Loader from "../../components/ui/Loader";
import {
  Search,
  Plus,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";


const roleStyles = {
  ADMIN: "bg-purple-50 text-purple-700",
  CUSTOMER: "bg-blue-50 text-blue-700",
};

const statusStyles = {
  true: "bg-green-50 text-green-700",
  false: "bg-red-50 text-red-700",
};

const initials = (user) =>
  `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("")

      const res = await fetch(`${BASE_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
      getUsers();
    }, [getUsers]);

  const pageSize = 5;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchText);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        String(user.isActive) === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activeCount = users.filter((user) => user.isActive).length;
  const inactiveCount = users.filter((user) => !user.isActive).length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  const resetPage = () => setCurrentPage(1);

  if (loading) {
    return <div><Loader /></div>;
  }

  if (error) {
    return <div><Loader message={error} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm text-gray-500">
              Admin / Users
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              Users
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage registered customers and administrator accounts.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total users"
            value={users.length}
            icon={<Users size={20} />}
            iconStyle="bg-blue-50 text-blue-700"
          />

          <StatCard
            title="Active users"
            value={activeCount}
            icon={<UserCheck size={20} />}
            iconStyle="bg-green-50 text-green-700"
          />

          <StatCard
            title="Inactive users"
            value={inactiveCount}
            icon={<UserX size={20} />}
            iconStyle="bg-red-50 text-red-700"
          />

          <StatCard
            title="Administrators"
            value={adminCount}
            icon={<ShieldCheck size={20} />}
            iconStyle="bg-purple-50 text-purple-700"
          />
        </div>

        {/* Users table */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                All users
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    resetPage();
                  }}
                  placeholder="Search users..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-900 sm:w-64"
                />
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={17}
                  className="text-gray-400"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    resetPage();
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                  aria-label="Filter by role"
                >
                  <option value="ALL">All roles</option>
                  <option value="CUSTOMER">Customers</option>
                  <option value="ADMIN">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    resetPage();
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                  aria-label="Filter by account status"
                >
                  <option value="ALL">All status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212 text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Phone</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Joined</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                          {initials(user)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {user.email}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.phone || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[user.role] ||
                          "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[String(user.isActive)]
                          }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          title="View user"
                          aria-label={`View ${user.firstName}`}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >
                      <Users
                        size={32}
                        className="mx-auto mb-3 text-gray-300"
                      />
                      <p className="font-medium text-gray-900">
                        No users found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {filteredUsers.length === 0
                ? "Showing 0 users"
                : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                  safePage * pageSize,
                  filteredUsers.length
                )} of ${filteredUsers.length} users`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={safePage === 1}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm ${safePage === page
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={safePage === totalPages}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* User details modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="user-modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                User details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-700">
                {initials(selectedUser)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-4 text-sm">
              <Detail label="User ID" value={selectedUser.id} />
              <Detail
                label="Phone"
                value={selectedUser.phone || "Not provided"}
              />
              <Detail label="Role" value={selectedUser.role} />
              <Detail
                label="Joined"
                value={formatDate(selectedUser.createdAt)}
              />
              <Detail
                label="Account status"
                value={selectedUser.isActive ? "Active" : "Inactive"}
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="mt-5 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, iconStyle }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-lg p-3 ${iconStyle}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="break-all text-right font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}
