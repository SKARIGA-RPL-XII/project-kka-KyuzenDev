"use client";

import { LuX, LuPlus, LuTrash2, LuPackage, LuLoader } from "react-icons/lu";
import { useProsesPesanan } from "@/hooks/useProsesPesanan";

interface ModalProsesPesananProps {
  pesananId: number;
  onClose: () => void;
  onSave: (data: {
    harga_total: number;
    konsultasi_apoteker: string;
    detail_pesanan: { obat_id: number; jumlah: number; subtotal: number }[];
  }) => void;
}

export default function ModalProsesPesanan({
  pesananId,
  onClose,
  onSave,
}: ModalProsesPesananProps) {
  const {
    konsultasi,
    setKonsultasi,
    totalHarga,
    detailPesanan,
    stokObat,
    selectedObatId,
    setSelectedObatId,
    jumlahObat,
    setJumlahObat,
    loadingStok,
    addObatToDetail,
    removeObatFromDetail,
    getPayload,
  } = useProsesPesanan();

  const handleSave = () => {
    onSave(getPayload());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Proses Pesanan{" "}
            <span className="text-emerald-600">#{pesananId}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <LuX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">
              Konsultasi Apoteker
            </h3>
            <textarea
              value={konsultasi}
              onChange={(e) => setKonsultasi(e.target.value)}
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="Masukkan saran penggunaan obat atau catatan konsultasi..."
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Pilih Obat</h3>
            <div className="flex gap-2 mb-4 items-center">
              <select
                value={selectedObatId}
                onChange={(e) => setSelectedObatId(e.target.value)}
                className="flex-grow p-3 border cursor-pointer border-gray-200 rounded-xl text-sm bg-white"
                disabled={loadingStok}
              >
                <option value="">
                  {loadingStok ? "Memuat stok..." : "Pilih Obat dari Stok"}
                </option>
                {stokObat.map((obat) => (
                  <option key={obat.id} value={obat.id}>
                    {obat.nama_obat} (Stok: {obat.stok}) - Rp
                    {obat.harga.toLocaleString("id-ID")}
                  </option>
                ))}
              </select>

              {loadingStok && (
                <LuLoader className="animate-spin text-emerald-600" size={20} />
              )}

              <input
                type="number"
                value={jumlahObat}
                onChange={(e) => setJumlahObat(parseInt(e.target.value) || 1)}
                min={1}
                className="w-20 p-3 border border-gray-200 rounded-xl text-sm"
              />
              <button
                onClick={addObatToDetail}
                disabled={!selectedObatId || loadingStok}
                className="p-3 bg-emerald-50 cursor-pointer text-emerald-600 rounded-xl hover:bg-emerald-100 disabled:opacity-50"
              >
                <LuPlus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-700 mb-4">
            Daftar Obat Pesanan
          </h3>
          {detailPesanan.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
              <LuPackage size={40} className="mx-auto mb-2 text-gray-400" />
              <p>Belum ada obat yang dipilih.</p>
              <p className="text-xs">
                Pilih obat di atas untuk menambahkannya.
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Nama Obat</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                    <th className="px-4 py-3 text-right">Harga Satuan</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailPesanan.map((item) => (
                    <tr key={item.obat_id}>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.nama_obat}
                      </td>
                      <td className="px-4 py-3 text-right">{item.jumlah}</td>
                      <td className="px-4 py-3 text-right">
                        Rp{item.harga_satuan.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                        Rp{item.subtotal.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeObatFromDetail(item.obat_id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <p className="text-xl font-bold text-gray-900">
            Total Harga:{" "}
            <span className="text-emerald-600">
              Rp{totalHarga.toLocaleString("id-ID")}
            </span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-200 bg-gray-100 font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={detailPesanan.length === 0}
              className="px-6 py-3 rounded-xl cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 font-semibold"
            >
              Selesaikan Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
