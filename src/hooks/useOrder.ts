import { useState } from "react";

interface OrderInput {
  keluhan: string;
  foto_resep?: File | null;
  total_harga: number;
}

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (orderData: OrderInput) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("keluhan", orderData.keluhan);
      formData.append("total_harga", orderData.total_harga.toString());

      if (orderData.foto_resep) {
        formData.append("foto_resep", orderData.foto_resep);
      }

      const response = await fetch("/api/pesanan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal membuat pesanan";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
};
