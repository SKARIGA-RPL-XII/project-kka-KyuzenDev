"use client";
import { useState, useEffect, useCallback } from "react";
import { UserRow } from "@/types/user";
import {
  LuLayoutDashboard,
  LuUsers,
  LuChevronRight,
  LuArrowLeft,
  LuTrash2,
  LuUser,
  LuShieldCheck,
  LuStethoscope,
} from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [view, setView] = useState<"menu" | "panel" | "users">("menu");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPasien: 0,
    totalApoteker: 0,
  });
  const [users, setUsers] = useState<UserRow[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setStats(data.stats);
      setUsers(data.users as UserRow[]);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const router = useRouter();

useEffect(() => {
  const storedData = localStorage.getItem("user");
  if (!storedData) {
    router.push("/auth/login");
    return;
  }

  const user = JSON.parse(storedData);
  if (user.role !== "Admin") {
    if (user.role === "Apoteker") router.replace("/dashboard/apoteker");
    else if (user.role === "Pasien") router.replace("/dashboard/pasien");
  }
}, [router]);
  
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        });
        if (response.ok) fetchData();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  if (loading && view === "menu") {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="animate-pulse text-gray-500 font-medium">
          Memuat Panel Admin...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {view !== "menu" && (
        <button
          onClick={() => setView(view === "users" ? "panel" : "menu")}
          className="group text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2 transition-colors"
        >
          <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>
            Kembali ke {view === "users" ? "Statistik" : "Menu Utama"}
          </span>
        </button>
      )}

      {view === "menu" && (
        <div
          onClick={() => setView("panel")}
          className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-red-100 hover:border-red-400 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                <LuLayoutDashboard size={32} />
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-1 text-gray-800 group-hover:text-red-600 transition-colors">
                  Panel Admin
                </h3>
                <p className="text-gray-500">
                  Kelola semua user, apoteker, dan laporan sistem secara
                  terpusat.
                </p>
              </div>
            </div>
            <LuChevronRight
              size={24}
              className="text-gray-300 group-hover:text-red-500 group-hover:translate-x-2 transition-all"
            />
          </div>
        </div>
      )}

      {view === "panel" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <LuShieldCheck className="text-red-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard Statistik
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-20 group-hover:scale-110 transition-transform">
                <LuUsers size={120} />
              </div>
              <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                <LuUser /> Total Pasien
              </h3>
              <p className="text-4xl font-black text-gray-900 mt-2">
                {stats.totalPasien}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-green-50 opacity-20 group-hover:scale-110 transition-transform">
                <LuStethoscope size={120} />
              </div>
              <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider flex items-center gap-2">
                <LuStethoscope /> Total Apoteker
              </h3>
              <p className="text-4xl font-black text-gray-900 mt-2">
                {stats.totalApoteker}
              </p>
            </div>
          </div>

          <div
            onClick={() => setView("users")}
            className="bg-white p-6 rounded-xl shadow-sm cursor-pointer border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all flex justify-between items-center group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <LuUsers size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Manajemen Pengguna
                </h3>
                <p className="text-sm text-gray-500">
                  Lihat detail, ubah status, atau hapus akun pengguna.
                </p>
              </div>
            </div>
            <LuChevronRight
              size={20}
              className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>
      )}

      {view === "users" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-in slide-in-from-right duration-500">
          <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LuUsers className="text-blue-600" size={24} />
              <h3 className="font-bold text-lg text-gray-800">
                Daftar Pengguna Aktif
              </h3>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
              Total: {users.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <LuUser size={20} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.nama}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            user.role === "Admin"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : user.role === "Apoteker"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-all cursor-pointer"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-gray-400 italic"
                    >
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}