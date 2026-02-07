import { useEffect, useState, useMemo } from "react";

interface Pesanan {
  id: number;
  nama_pasien: string;
  keluhan: string;
  foto_resep: string | null;
  total_harga: number;
  createdAt: string;
  status: "Menunggu Konfirmasi" | "Diproses" | "Selesai" | "Dibatalkan";
}

export const usePesananMasuk = () => {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Semua");
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

        console.log("Data API:", data);

        setPesananList(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
      setPesananList([]); // Set ke array kosong jika error
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const message =
      newStatus === "Dibatalkan"
        ? "Apakah Anda yakin ingin membatalkan pesanan ini?"
        : "Apakah Anda yakin ingin memproses pesanan ini?";

    if (!window.confirm(message)) {
      return;
    }

    try {
      const response = await fetch("/api/pesanan/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        console.log("Update berhasil, mengambil data ulang...");
        await fetchPesanan();
      }
    } catch (error) {
      console.error("Gagal update status", error);
    }
  };

  const filteredPesanan = useMemo(() => {
    if (!Array.isArray(pesananList)) return [];

    return pesananList.filter((p) => {
      let matchesTab = false;

      if (activeTab === "Semua") {
        matchesTab = true;
      } else if (activeTab === "Diproses") {
        matchesTab = p.status === "Diproses";
      } else if (activeTab === "Selesai") {
        matchesTab = p.status === "Selesai";
      } else {
        matchesTab = p.status === activeTab;
      }

      const matchesSearch =
        p.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm);

      return matchesTab && matchesSearch;
    });
  }, [pesananList, searchTerm, activeTab]);

  const totalItems = filteredPesanan.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPesanan.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPesanan, currentPage]);

  const totalPesanan = pesananList.length;
  const menungguKonfirmasi = Array.isArray(pesananList)
    ? pesananList.filter((p) => p.status === "Menunggu Konfirmasi").length
    : 0;

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
    activeTab,
    setActiveTab,
  };
};
