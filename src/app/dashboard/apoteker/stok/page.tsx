"use client";
import { useObat } from "@/hooks/useObat";
import { useObatLogic } from "@/hooks/useObatLogic";
import TableStok from "@/app/components/dashboard/apoteker/components/table/tableStok";
import Link from "next/link";
import { useState } from "react";
import ModalTambahObat from "@/app/components/dashboard/apoteker/components/modal/ModalTambahObat";
import ModalEditObat from "@/app/components/dashboard/apoteker/components/modal/ModalEditObat";
import {
  LuPackage2,
  LuArrowLeft,
  LuPlus,
  LuSearch,
  LuCircleAlert,
  LuCircleCheck,
} from "react-icons/lu";
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "red" | "emerald";
}

export default function StokPage() {
  const { data, loading, refresh } = useObat();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    searchTerm,
    handleSearchChange,
    currentItems,
    currentPage,
    setCurrentPage,
    handleEditClick,
    handleDelete,
    totalPages,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedObat,
  } = useObatLogic(data, refresh);

  const totalStok = data.length;
  const stokRendah = data.filter((item) => item.stok < 10).length;
  const stokAman = totalStok - stokRendah;

  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen text-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/apoteker"
            className="p-2.5 bg-white text-gray-600 border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all shadow-sm"
          >
            <LuArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Inventaris Obat
            </h1>
            <p className="text-gray-500 font-medium">
              Kelola ketersediaan dan harga obat apotek
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)} // Buka modal
          className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200 font-semibold"
        >
          <LuPlus size={20} strokeWidth={3} />
          <span>Tambah Obat Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<LuPackage2 />}
          label="Total Jenis Obat"
          value={totalStok}
          color="blue"
        />
        <StatCard
          icon={<LuCircleAlert />}
          label="Stok Menipis (<10)"
          value={stokRendah}
          color="red"
        />
        <StatCard
          icon={<LuCircleCheck />}
          label="Stok Aman"
          value={stokAman}
          color="emerald"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-96">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama obat atau kategori..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 text-black border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-900 font-bold text-lg">
                Menyinkronkan Data
              </p>
              <p className="text-gray-400 text-sm">Memuat data...</p>
            </div>
          </div>
        ) : (
          <TableStok
            data={currentItems}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <ModalTambahObat
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
      {isEditModalOpen && selectedObat && (
        <ModalEditObat
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={refresh}
          obat={selectedObat}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
