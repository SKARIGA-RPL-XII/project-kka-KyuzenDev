"use client";
import {
  LuHistory,
  LuShoppingBag,
  LuUser,
  LuChevronRight,
} from "react-icons/lu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrder";
import OrderModal from "@/app/components/dashboard/pasien/components/modal/OrderModal";
import RiwayatModal from "@/app/components/dashboard/pasien/components/modal/RiwayatModal";
import { Pesanan } from "@/types/pesanan";

export default function PasienPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { placeOrder, loading } = useOrder();
  const [isRiwayatOpen, setIsRiwayatOpen] = useState(false);
  const [dataRiwayat, setDataRiwayat] = useState<Pesanan[]>([]);
  const [unreadNotif, setUnreadNotif] = useState(0);

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

  const fetchRiwayatNotif = async () => {
    try {
      const response = await fetch(`/api/riwayat`);
      const result = await response.json();
      if (response.ok) {
        setUnreadNotif(result.unreadCount || 0);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    }
  };

  useEffect(() => {
    fetchRiwayatNotif();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role !== "Pasien") {
        if (user.role === "Admin") router.replace("/dashboard/admin");
        else if (user.role === "Apoteker")
          router.replace("/dashboard/apoteker");
        else router.push("/auth/login");
      }
    }
  }, [router]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        onClick={handleOpenRiwayat}
        className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all group relative"
      >
        {unreadNotif > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            {unreadNotif}
          </span>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <LuHistory size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                Riwayat Pembelian
              </h3>
              <p className="text-gray-500 text-sm">
                Lihat daftar obat yang pernah dibeli.
              </p>
            </div>
          </div>
          <LuChevronRight
            size={24}
            className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all"
          />
        </div>
      </div>

      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all group"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <LuShoppingBag size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                Pesan Obat
              </h3>
              <p className="text-gray-500 text-sm">
                {loading ? "Memproses..." : "Cari dan pesan obat dari apotek."}
              </p>
            </div>
          </div>
          <LuChevronRight
            size={24}
            className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all"
          />
        </div>
      </div>
      <Link href="/dashboard/profile">
        <div className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-gray-100 hover:border-gray-400 hover:shadow-md transition-all group">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gray-50 rounded-2xl text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-all duration-300">
                <LuUser size={32} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-gray-600 transition-colors">
                  Profil Saya
                </h3>
                <p className="text-gray-500 text-sm">
                  Ubah data diri dan password.
                </p>
              </div>
            </div>
            <LuChevronRight
              size={24}
              className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-2 transition-all"
            />
          </div>
        </div>
      </Link>

      <RiwayatModal
        isOpen={isRiwayatOpen}
        onClose={() => setIsRiwayatOpen(false)}
        data={dataRiwayat}
      />
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleOrderSubmit}
        loading={loading}
      />
    </div>
  );
}