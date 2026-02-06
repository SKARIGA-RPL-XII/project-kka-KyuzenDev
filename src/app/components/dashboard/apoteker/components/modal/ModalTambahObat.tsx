"use client";
import { useTambahObat } from "@/hooks/useTambahObat";
import { LuX, LuPackagePlus } from "react-icons/lu";

interface ModalTambahObatProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalTambahObat({
  isOpen,
  onClose,
  onSuccess,
}: ModalTambahObatProps) {
  const { formData, loading, handleChange, handleSubmit } = useTambahObat(
    onSuccess,
    onClose,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <LuPackagePlus size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Tambah Obat Baru
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 cursor-pointer hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Nama Obat
            </label>
            <input
              type="text"
              name="nama_obat"
              required
              className="w-full mt-1.5 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contoh: Paracetamol 500mg"
              value={formData.nama_obat}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Kategori
              </label>
              <input
                type="text"
                name="kategori"
                required
                className="w-full mt-1.5 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Contoh: Tablet"
                value={formData.kategori}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Stok Awal
              </label>
              <input
                type="number"
                name="stok"
                required
                className="w-full mt-1.5 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="0"
                min="0"
                value={formData.stok}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Harga Jual (Rp)
            </label>
            <input
              type="number"
              name="harga"
              required
              className="w-full mt-1.5 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="10000"
              value={formData.harga}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 cursor-pointer rounded-xl text-gray-700 hover:bg-gray-200 bg-gray-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 cursor-pointer bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Obat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
