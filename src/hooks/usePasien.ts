import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { Pesanan } from "@/types/pesanan";
import Cookies from "js-cookie";

export const usePasien = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { placeOrder, loading: orderLoading } = useOrder();
  const [isRiwayatOpen, setIsRiwayatOpen] = useState(false);
  const [dataRiwayat, setDataRiwayat] = useState<Pesanan[]>([]);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchRiwayatNotif = useCallback(async () => {
    try {
      const response = await fetch(`/api/riwayat`);
      const result = await response.json();
      if (response.ok) {
        setUnreadNotif(result.unreadCount || 0);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    }
  }, []);

  const handleOrderSubmit = async (data: {
    keluhan: string;
    foto_resep: File | null;
  }) => {
    try {
      await placeOrder({
        keluhan: data.keluhan,
        total_harga: 0,
        foto_resep: data.foto_resep,
      });
      alert("Pesanan berhasil dikirim!");
      setIsModalOpen(false);
      fetchRiwayatNotif();
    } catch (err) {
      alert(
        `Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`,
      );
    }
  };

  const handleOpenRiwayat = async () => {
    try {
      const response = await fetch(`/api/riwayat`);
      const result = await response.json();

      if (response.ok) {
        setDataRiwayat(result.data);

        if (result.unreadCount > 0) {
          await fetch("/api/riwayat", { method: "PATCH" });
          setUnreadNotif(0);
        }

        setIsRiwayatOpen(true);
      } else {
        throw new Error(result.error || "Gagal mengambil data");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data riwayat");
    }
  };

  useEffect(() => {
    const role = Cookies.get("role");

    if (!role || role !== "Pasien") {
      router.replace(role ? `/dashboard/${role.toLowerCase()}` : "/auth/login");
      return;
    }
    setIsPageLoading(false);
  }, [router]);

  useEffect(() => {
    fetchRiwayatNotif();
  }, [fetchRiwayatNotif]);

  return {
    isModalOpen,
    setIsModalOpen,
    isRiwayatOpen,
    setIsRiwayatOpen,
    dataRiwayat,
    unreadNotif,
    orderLoading,
    handleOrderSubmit,
    handleOpenRiwayat,
    isPageLoading,
  };
};
