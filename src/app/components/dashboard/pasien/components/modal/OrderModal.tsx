"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { LuX, LuSend, LuEye } from "react-icons/lu";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { keluhan: string; foto_resep: File | null }) => void;
  loading: boolean;
}

export default function OrderModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: OrderModalProps) {
  const [keluhan, setKeluhan] = useState("");
  const [fileAsli, setFileAsli] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar!");
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setFileAsli(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const openPreviewInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keluhan.trim()) {
      setError("Keluhan harus diisi!");
      return;
    }
    onSubmit({ keluhan, foto_resep: fileAsli });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Form Pesan Obat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          >
            <LuX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keluhan / Konsultasi
            </label>
            <textarea
              required
              rows={4}
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              className="w-full border border-gray-300 rounded-lg text-gray-500 placeholder:text-gray-400 focus:text-gray-800 p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              placeholder="Jelaskan keluhan Anda..."
            />
          </div>

          <div>
            {previewUrl && (
              <div className="flex items-center justify-between p-3 mb-2 border rounded-lg bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-sm text-gray-700 font-medium truncate">
                    {fileAsli?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={openPreviewInNewTab}
                  className="flex items-center cursor-pointer gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold flex-shrink-0"
                >
                  <LuEye size={18} />
                  Lihat Foto
                </button>
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Resep / Pendukung (Optional)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <LuSend size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  {previewUrl
                    ? "Klik untuk ganti foto"
                    : "Klik untuk upload foto"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "Kirim Pesanan"}
          </button>
        </form>
      </div>
    </div>
  );
}
