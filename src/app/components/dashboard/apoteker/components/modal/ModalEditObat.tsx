"use client";
import { useState, useEffect } from "react";
import { Obat } from "@/hooks/useObat";
import { LuPackage, LuX } from "react-icons/lu";

interface ModalEditObatProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  obat: Obat;
}

export default function ModalEditObat({
  isOpen,
  onClose,
  onSuccess,
  obat,
}: ModalEditObatProps) {
  const [formData, setFormData] = useState({
    nama_obat: "",
    kategori: "",
    stok: 0,
    harga: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (obat) {
      setFormData({
        nama_obat: obat.nama_obat,
        kategori: obat.kategori,
        stok: obat.stok,
        harga: obat.harga,
      });
    }
  }, [obat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/obat/${obat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal mengupdate obat");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengupdate obat");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <LuPackage size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Edit Obat</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Obat
            </label>
            <input
              type="text"
              value={formData.nama_obat}
              onChange={(e) =>
                setFormData({ ...formData, nama_obat: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok
              </label>
              <input
                type="number"
                value={formData.stok}
                min="0"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const validatedValue = Math.max(0, isNaN(value) ? 0 : value);

                  setFormData({ ...formData, stok: validatedValue });
                }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Jual (Rp)
            </label>
            <input
              type="number"
              value={formData.harga}
              onChange={(e) =>
                setFormData({ ...formData, harga: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-200 bg-gray-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 font-semibold disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
