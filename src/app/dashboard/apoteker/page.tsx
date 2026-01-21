"use client";
import {
  LuPackage,
  LuClipboardList,
  LuUser,
  LuChevronRight,
} from "react-icons/lu";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApotekerPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "Apoteker") {
      if (user.role === "Admin") router.replace("/dashboard/admin");
      else if (user.role === "Pasien") router.replace("/dashboard/pasien");
      else router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-emerald-100 hover:border-emerald-400 hover:shadow-md transition-all group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <LuPackage size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-emerald-600 transition-colors">
                Kelola Stok
              </h3>
              <p className="text-gray-500 text-sm">
                Update jumlah dan harga obat.
              </p>
            </div>
          </div>
          <LuChevronRight
            size={24}
            className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm cursor-pointer border border-emerald-100 hover:border-emerald-400 hover:shadow-md transition-all group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <LuClipboardList size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-emerald-600 transition-colors">
                Pesanan Masuk
              </h3>
              <p className="text-gray-500 text-sm">
                Verifikasi resep dan pesanan.
              </p>
            </div>
          </div>
          <LuChevronRight
            size={24}
            className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all"
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
