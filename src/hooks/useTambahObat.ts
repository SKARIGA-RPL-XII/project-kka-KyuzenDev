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
      const response = await fetch("/api/obat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          stok: Number(formData.stok),
          harga: Number(formData.harga),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambah obat");
      }

      console.log("Data berhasil dikirim ke database");

      onSuccessCallback();
      onCloseCallback();
      setFormData({ nama_obat: "", kategori: "", stok: "", harga: "" });
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
