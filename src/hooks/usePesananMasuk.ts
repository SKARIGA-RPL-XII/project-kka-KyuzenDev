import { useEffect, useState, useMemo, useCallback } from "react";

interface Pesanan {
  id: number;
  user_id: number;
  nama_pasien: string;
  keluhan: string;
  foto_resep: string | null;
  status: string;
  createdAt: string;
  nama_apoteker: string | null | undefined;
  harga_total: number | null | undefined;
  detail_obat?: Array<{
    nama_obat: string;
    jumlah: number;
    subtotal: number;
  }>;
}

export const usePesananMasuk = () => {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Menunggu Konfirmasi");
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPesananId, setSelectedPesananId] = useState<number | null>(
    null,
  );

  const fetchPesanan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pesanan?status=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setPesananList(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error(error);
      setPesananList([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPesanan();
  }, [activeTab, fetchPesanan]);

  const handleUpdateStatus = async (
    id: number,
    newStatus: string,
    additionalData = {},
  ) => {
    if (newStatus === "Dibatalkan") {
      if (!window.confirm("Yakin ingin membatalkan pesanan ini?")) {
        return;
      }
    }

    try {
      const response = await fetch("/api/pesanan/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, ...additionalData }),
      });

      if (response.ok) {
        await fetchPesanan();
        if (newStatus === "Selesai") {
          setIsModalOpen(false);
          setSelectedPesananId(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openProcessModal = (id: number) => {
    setSelectedPesananId(id);
    setIsModalOpen(true);
  };

  const filteredPesanan = useMemo(() => {
    if (!Array.isArray(pesananList)) return [];

    return pesananList.filter((p) => {
      let matchesTab = false;
      if (activeTab === "Semua") {
        matchesTab = true;
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
  const menungguKonfirmasiCount = Array.isArray(pesananList)
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
    setSelectedPesananId,
    totalPesanan,
    menungguKonfirmasiCount,
    handleUpdateStatus,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    selectedPesananId,
    openProcessModal,
  };
};
