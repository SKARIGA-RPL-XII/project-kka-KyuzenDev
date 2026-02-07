"use client";

import { useState, useEffect, useCallback } from "react";

interface Obat {
  id: number;
  nama_obat: string;
  stok: number;
  harga: number;
}

interface DetailPesananItem {
  obat_id: number;
  nama_obat: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export const useProsesPesanan = () => {
  const [konsultasi, setKonsultasi] = useState("");
  const [totalHarga, setTotalHarga] = useState(0);
  const [detailPesanan, setDetailPesanan] = useState<DetailPesananItem[]>([]);
  const [stokObat, setStokObat] = useState<Obat[]>([]);
  const [selectedObatId, setSelectedObatId] = useState("");
  const [jumlahObat, setJumlahObat] = useState(1);
  const [loadingStok, setLoadingStok] = useState(true);

  const fetchStokObat = useCallback(async () => {
    setLoadingStok(true);
    try {
      const response = await fetch("/api/obat");
      if (response.ok) {
        const result = await response.json();
        const dataObat = Array.isArray(result) ? result : result.data || [];
        setStokObat(dataObat);
      } else {
        console.error("Respon tidak OK");
      }
    } catch (error) {
      console.error("Error fetching stok obat", error);
    } finally {
      setLoadingStok(false);
    }
  }, []);

  useEffect(() => {
    fetchStokObat();
  }, [fetchStokObat]);

  const addObatToDetail = () => {
    const obat = stokObat.find((o) => o.id === parseInt(selectedObatId));
    if (!obat || jumlahObat <= 0) return;

    if (jumlahObat > obat.stok) {
      alert(`Jumlah melebihi stok tersedia (${obat.stok})`);
      return;
    }

    const subtotal = obat.harga * jumlahObat;
    const newItem: DetailPesananItem = {
      obat_id: obat.id,
      nama_obat: obat.nama_obat,
      jumlah: jumlahObat,
      harga_satuan: obat.harga,
      subtotal: subtotal,
    };

    setDetailPesanan([...detailPesanan, newItem]);
    setTotalHarga(totalHarga + subtotal);
    setSelectedObatId("");
    setJumlahObat(1);
  };

  const removeObatFromDetail = (obatId: number) => {
    const itemToRemove = detailPesanan.find((item) => item.obat_id === obatId);
    if (!itemToRemove) return;

    setDetailPesanan(detailPesanan.filter((item) => item.obat_id !== obatId));
    setTotalHarga(totalHarga - itemToRemove.subtotal);
  };

  const getPayload = () => {
    return {
      harga_total: totalHarga,
      konsultasi_apoteker: konsultasi,
      detail_pesanan: detailPesanan.map((item) => ({
        obat_id: item.obat_id,
        jumlah: item.jumlah,
        subtotal: item.subtotal,
      })),
    };
  };

  return {
    konsultasi,
    setKonsultasi,
    totalHarga,
    detailPesanan,
    stokObat,
    selectedObatId,
    setSelectedObatId,
    jumlahObat,
    setJumlahObat,
    loadingStok,
    addObatToDetail,
    removeObatFromDetail,
    getPayload,
  };
};
