"use client";
import { useAdmin } from "@/hooks/useAdmin";
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
import Image from "next/image";

export default function AdminPage() {
  const {
    view,
    setView,
    loading,
    stats,
    currentItems,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDelete,
    handleRoleChange,
    filteredUsersCount,
  } = useAdmin();

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
          <div className="p-5 border-b bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <LuUsers className="text-blue-600" size={24} />
                <h3 className="font-bold text-lg text-gray-800">
                  Daftar Pengguna
                </h3>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                Total: {filteredUsersCount}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 p-2 text-sm border rounded-lg outline-blue-500 focus:placeholder-gray-300 placeholder-gray-500 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="p-2 text-sm border cursor-pointer rounded-lg outline-blue-500 bg-white text-black"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">Semua Role</option>
                <option value="Admin">Admin</option>
                <option value="Apoteker">Apoteker</option>
                <option value="Pasien">Pasien</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden relative border bg-gray-100 flex-shrink-0">
                            <Image
                              src={
                                user.photo_profile &&
                                user.photo_profile.startsWith("data:image")
                                  ? user.photo_profile
                                  : "/dummy_user.png"
                              }
                              alt={user.nama}
                              fill
                              sizes="2.5rem"
                              className="object-cover"
                              unoptimized
                              priority
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-none">
                              {user.nama}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value, user.role)
                          }
                          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border cursor-pointer outline-none appearance-none text-center transition-all ${
                            user.role === "Admin"
                              ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                              : user.role === "Apoteker"
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                          }`}
                        >
                          <option value="Pasien">Pasien</option>
                          <option value="Apoteker">Apoteker</option>
                          <option value="Admin">Admin</option>
                        </select>
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
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50 flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded text-black cursor-pointer bg-white hover:bg-gray-100 disabled:opacity-50 transition-all text-sm"
              >
                Prev
              </button>
              <span className="text-sm text-black font-medium">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border text-black cursor-pointer rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition-all text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
