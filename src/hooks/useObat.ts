import { useState, useEffect } from "react";

export interface Obat {
  id: number;
  nama_obat: string;
  harga: number;
  stok: number;
  kategori: string;
}

export function useObat() {
  const [data, setData] = useState<Obat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchObat = async () => {
    try {
      const res = await fetch("/api/obat");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObat();
  }, []);

  return { data, loading, refresh: fetchObat };
}