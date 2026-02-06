import { useState } from "react";

export interface FormDataTambahObat {
  nama_obat: string;
  kategori: string;
  stok: number | string;
  harga: number | string;
}

export function useTambahObat(
  onSuccessCallback: () => void,
  onCloseCallback: () => void,
) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataTambahObat>({
    nama_obat: "",
    kategori: "",
    stok: "",
    harga: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedStok = Math.max(0, Number(formData.stok) || 0);
      const validatedHarga = Math.max(0, Number(formData.harga) || 0);

      const response = await fetch("/api/obat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          stok: validatedStok,
          harga: validatedHarga,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambah obat");
      }

      console.log("Data berhasil dikirim ke database");

      onSuccessCallback();
      onCloseCallback();
      setFormData({ nama_obat: "", kategori: "", stok: 0, harga: 0 });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
  };
}
