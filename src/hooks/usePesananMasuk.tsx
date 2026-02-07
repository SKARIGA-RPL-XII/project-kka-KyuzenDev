import { useEffect, useState, useMemo } from "react";

interface Pesanan {
  id: number;
  nama_pasien: string;
  keluhan: string;
  foto_resep: string | null;
  total_harga: number;
  createdAt: string;
  status: string;
}

export const usePesananMasuk = () => {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pesanan");
      if (response.ok) {
        const data = await response.json();
        setPesananList(data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("/api/pesanan/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        fetchPesanan();
      }
    } catch (error) {
      console.error("Gagal update status", error);
    }
  };

  const filteredPesanan = useMemo(() => {
    return pesananList.filter(
      (p) =>
        p.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm),
    );
  }, [pesananList, searchTerm]);

  const totalItems = filteredPesanan.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPesanan.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPesanan, currentPage]);

  const totalPesanan = pesananList.length;
  const menungguKonfirmasi = pesananList.filter(
    (p) => p.status === "Menunggu Konfirmasi",
  ).length;

  return {
    currentItems,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalPesanan,
    menungguKonfirmasi,
    handleUpdateStatus,
  };
};
