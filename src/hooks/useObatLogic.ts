import { useState, useMemo } from "react";
import { Obat } from "./useObat";

export function useObatLogic(data: Obat[], refreshData: () => Promise<void>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedObat, setSelectedObat] = useState<Obat | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        roleFilter === "All" || item.kategori === roleFilter;

      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, roleFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleEditClick = (obat: Obat) => {
    setSelectedObat(obat);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus obat ini?")) return;

    try {
      const response = await fetch(`/api/obat/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus obat");

      console.log("Obat berhasil dihapus");
      refreshData();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setRoleFilter(filter);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    handleSearchChange,
    roleFilter,
    handleFilterChange,
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    handleEditClick,
    handleDelete,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedObat,
  };
}
