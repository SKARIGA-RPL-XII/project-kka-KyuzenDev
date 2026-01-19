"use client";

import { useState, useEffect, useCallback } from "react";
import { UserRow } from "@/types/user";

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

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      console.log("Menghapus user id:", id);
    }
  };

  if (loading && view === "menu") {
    return (
      <div className="text-center p-10 animate-pulse">
        Memuat Panel Admin...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {view !== "menu" && (
        <button
          onClick={() => setView(view === "users" ? "panel" : "menu")}
          className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2 transition-colors"
        >
          ← Kembali ke {view === "users" ? "Statistik" : "Menu Utama"}
        </button>
      )}
      {view === "menu" && (
        <div
          onClick={() => setView("panel")}
          className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-red-200 hover:border-red-400 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl mb-2 text-red-600 group-hover:text-red-700">
                Panel Admin
              </h3>
              <p className="text-gray-500">
                Kelola semua user, apoteker, dan laporan sistem secara terpusat.
              </p>
            </div>
            <span className="text-3xl group-hover:translate-x-2 transition-transform">
              ⚙️
            </span>
          </div>
        </div>
      )}

      {view === "panel" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Statistik
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                Total Pasien
              </h3>
              <p className="text-4xl font-black text-gray-900 mt-2">
                {stats.totalPasien}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider">
                Total Apoteker
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
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Manajemen Pengguna
              </h3>
              <p className="text-sm text-gray-500">
                Lihat detail, ubah status, atau hapus akun pengguna.
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="text-xl">→</span>
            </div>
          </div>
        </div>
      )}

      {view === "users" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-in slide-in-from-right duration-500">
          <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">
              Daftar Pengguna Aktif
            </h3>
            <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
              Total: {users.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "Admin"
                              ? "bg-red-100 text-red-700"
                              : user.role === "Apoteker"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 cursor-pointer hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-gray-500"
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
