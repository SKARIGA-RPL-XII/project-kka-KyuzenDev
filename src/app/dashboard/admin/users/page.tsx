"use client";
import { useAdmin } from "@/hooks/useAdmin";
import TableUser from "@/app/components/dashboardAdmin/components/table/tableUser";
import Link from "next/link";
import { LuArrowLeft, LuSearch } from "react-icons/lu";

export default function UsersPage() {
  const {
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
  } = useAdmin();

  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/stats"
          className="p-2.5 bg-white text-gray-600 border border-gray-200 hover:text-red-600 rounded-xl shadow-sm"
        >
          <LuArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Manajemen Pengguna
        </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari user..."
              className="w-full pl-11 pr-4 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 text-black cursor-pointer bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">Semua Role</option>
            <option value="Admin">Admin</option>
            <option value="Apoteker">Apoteker</option>
            <option value="Pasien">Pasien</option>
          </select>
        </div>

        <TableUser
          data={currentItems.map((item) => ({
            ...item,
            photo_profile: item.photo_profile || "",
          }))}
          handleRoleChange={handleRoleChange}
          handleDelete={handleDelete}
        />

        {totalPages > 1 && (
          <div className="p-6 border-t text-black border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
