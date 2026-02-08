"use client";
import {
  LuX,
  LuPackage,
  LuPill,
  LuCalendarDays,
  LuStethoscope,
} from "react-icons/lu";

interface ObatItem {
  jumlah: number;
  subtotal: number | string;
  nama_obat: string;
}

interface Pesanan {
  id: number;
  user_id: number;
  keluhan: string;
  foto_resep: string | null;
  status: string;
  createdAt: string;
  harga_total: number | string;
  nama_apoteker?: string | null;
  detail_obat?: ObatItem[] | string | null;
}

interface RiwayatModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Pesanan[];
}

export default function RiwayatModal({
  isOpen,
  onClose,
  data,
}: RiwayatModalProps) {
  if (!isOpen) return null;
  const parseObatList = (
    detail: ObatItem[] | string | null | undefined,
  ): ObatItem[] => {
    if (!detail) return [];
    if (typeof detail === "string") {
      try {
        return JSON.parse(detail) as ObatItem[];
      } catch {
        return [];
      }
    }
    return detail;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Diproses":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Siap Di Ambil":
        return "bg-green-50 text-green-700 border-green-200";
      case "Dibatalkan":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-sky-100 p-2.5 rounded-2xl text-sky-600">
              <LuPackage size={26} />
            </div>
            <h2 className="text-2xl font-bold text-slate-950">
              Riwayat Pembelian
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          >
            <LuX size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
          {data.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
              <LuPackage size={50} className="mx-auto mb-4 text-slate-300" />
              <p className="font-semibold text-lg text-slate-700">
                Belum ada riwayat
              </p>
              <p className="text-sm">
                Data pembelian Anda akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {data.map((pesanan) => {
                const obatList = parseObatList(pesanan.detail_obat);

                return (
                  <div
                    key={pesanan.id}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-sky-100 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-5 gap-3">
                      <div>
                        <span className="font-bold text-lg text-slate-900">
                          #{pesanan.id}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <LuCalendarDays size={13} />
                          {new Date(pesanan.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${getStatusColor(
                          pesanan.status,
                        )}`}
                      >
                        {pesanan.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-5 flex-grow">
                      <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <LuPill size={16} className="text-slate-400" /> Daftar
                        Obat
                      </h4>

                      <div className="space-y-2">
                        {obatList.length > 0 ? (
                          obatList.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm text-slate-700 bg-slate-50 p-3 rounded-xl"
                            >
                              <span className="font-medium">
                                {item.nama_obat}{" "}
                                <span className="text-slate-400 font-normal">
                                  x{item.jumlah}
                                </span>
                              </span>
                              <span className="font-semibold text-slate-900">
                                Rp
                                {Number(item.subtotal).toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                            Detail obat tidak tersedia.
                          </p>
                        )}
                      </div>

                      {/* --- TAMBAHKAN BAGIAN INI UNTUK NAMA APOTEKER --- */}
                      {pesanan.nama_apoteker && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                          <LuStethoscope size={16} className="text-sky-500" />
                          <span className="font-medium">Petugas Apotek:</span>
                          <span className="text-sky-800 font-semibold">
                            {pesanan.nama_apoteker}
                          </span>
                        </div>
                      )}
                      {/* ----------------------------------------------- */}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                      <span className="font-semibold text-slate-600">
                        Total
                      </span>
                      <span className="text-xl font-bold text-sky-700 flex items-center gap-1.5">
                        Rp{Number(pesanan.harga_total).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
