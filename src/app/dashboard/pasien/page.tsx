"use client";
import {
  LuHistory,
  LuShoppingBag,
  LuUser,
  LuChevronRight,
} from "react-icons/lu";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasienPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "Pasien") {
      if (user.role === "Admin") router.replace("/dashboard/admin");
      else if (user.role === "Apoteker") router.replace("/dashboard/apoteker");
      else router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <LuHistory size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                Riwayat Resep
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
      <div className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all group">
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
                Cari dan pesan obat dari apotek.
              </p>
            </div>
          </div>
          <LuChevronRight
            size={24}
            className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all"
          />
        </div>
      </div>
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
    </div>
  );
}
