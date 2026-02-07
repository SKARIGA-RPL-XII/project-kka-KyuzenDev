"use client";

import Link from "next/link";
import {
  LuEye,
  LuCheck,
  LuCircleMinus,
  LuArrowLeft,
  LuSearch,
  LuClipboardList,
  LuCircleAlert,
  LuChevronLeft,
  LuChevronRight,
  LuClock3,
  LuPackageCheck,
  LuClipboard,
} from "react-icons/lu";
import { usePesananMasuk } from "@/hooks/usePesananMasuk";
import { useState } from "react";
import ModalResep from "@/app/components/dashboard/apoteker/components/modal/ModalResep";
import ModalProsesPesanan from "@/app/components/dashboard/apoteker/components/modal/ModalProsesPesanan";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "red" | "emerald";
}

export default function PesananMasukPage() {
  const {
    currentItems,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalPesanan,
    setSelectedPesananId,
    menungguKonfirmasiCount,
    handleUpdateStatus,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    selectedPesananId,
    openProcessModal,
  } = usePesananMasuk();

  const [selectedResep, setSelectedResep] = useState<{
    keluhan: string;
    nama: string;
    tanggal: string;
    foto: string;
  } | null>(null);

  const tabs = [
    { name: "Semua", icon: LuClipboardList },
    { name: "Menunggu Konfirmasi", icon: LuCircleAlert },
    { name: "Diproses", icon: LuClock3 },
    { name: "Selesai", icon: LuPackageCheck },
  ];
  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen text-black p-6">
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
              Pesanan Masuk
            </h1>
            <p className="text-gray-500 font-medium">
              Verifikasi resep dan keluhan pasien
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<LuClipboardList />}
          label="Total Pesanan Masuk"
          value={totalPesanan}
          color="blue"
        />
        <StatCard
          icon={<LuCircleAlert />}
          label="Menunggu Konfirmasi"
          value={menungguKonfirmasiCount}
          color="red"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col gap-4 bg-white">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <LuSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari ID atau Nama Pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-full sm:w-auto overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.name
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
            <p className="text-gray-900 font-bold text-lg">
              Menyinkronkan Data
            </p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-32 text-gray-500">
            Tidak ada pesanan masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="px-6 pb-6 grid gap-4">
              {currentItems.map((pesanan) => (
                <div
                  key={pesanan.id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        #{pesanan.id}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          pesanan.status === "Menunggu Konfirmasi"
                            ? "bg-yellow-100 text-yellow-700"
                            : pesanan.status === "Diproses"
                              ? "bg-blue-100 text-blue-700"
                              : pesanan.status === "Selesai"
                                ? "bg-emerald-100 text-emerald-700"
                                : pesanan.status === "Dibatalkan"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {pesanan.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mt-1">
                      {pesanan.nama_pasien}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 mb-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {pesanan.keluhan}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(pesanan.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedResep({
                          nama: pesanan.nama_pasien,
                          tanggal: new Date(pesanan.createdAt).toLocaleString(
                            "id-ID",
                          ),
                          foto: pesanan.foto_resep!,
                          keluhan: pesanan.keluhan,
                        })
                      }
                      className="p-3 rounded-xl cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                      title="Lihat Resep"
                    >
                      <LuEye size={20} />
                    </button>

                    {activeTab === "Menunggu Konfirmasi" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(pesanan.id, "Diproses")
                          }
                          className="p-3 cursor-pointer rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          title="Terima Pesanan"
                        >
                          <LuCheck size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(pesanan.id, "Dibatalkan")
                          }
                          className="p-3 cursor-pointer rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Batalkan Pesanan"
                        >
                          <LuCircleMinus size={20} />
                        </button>
                      </>
                    )}

                    {activeTab === "Diproses" && (
                      <button
                        onClick={() => openProcessModal(pesanan.id)}
                        className="px-4 py-2 cursor-pointer rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-semibold"
                        title="Proses & Selesaikan"
                      >
                        <LuClipboard size={18} />
                        Proses & Selesaikan
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {selectedResep && (
                <ModalResep
                  isOpen={!!selectedResep}
                  onClose={() => setSelectedResep(null)}
                  keluhan={selectedResep.keluhan}
                  namaPasien={selectedResep.nama}
                  tanggal={selectedResep.tanggal}
                  fotoResep={selectedResep.foto}
                />
              )}

              {isModalOpen && selectedPesananId && (
                <ModalProsesPesanan
                  pesananId={selectedPesananId}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPesananId(null);
                  }}
                  onSave={(data) => {
                    handleUpdateStatus(selectedPesananId, "Selesai", data);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50/30 flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 cursor-pointer bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2.5 cursor-pointer bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
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
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
