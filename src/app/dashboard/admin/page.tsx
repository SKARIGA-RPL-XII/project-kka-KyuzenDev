import Link from "next/link";
import { LuLayoutDashboard, LuShieldCheck } from "react-icons/lu";

export default function AdminPage() {
  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen">
      <Link href="/dashboard/admin/stats">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-50 hover:border-red-400 hover:shadow-xl hover:shadow-red-50 transition-all group cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <LuLayoutDashboard size={40} />
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-1 text-gray-800 group-hover:text-red-600 transition-colors">
                  Buka Panel Admin
                </h3>
                <p className="text-gray-500 max-w-md">
                  Kelola seluruh pengguna, hak akses, dan pantau aktivitas
                  sistem secara real-time.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-full bg-gray-50 group-hover:bg-red-50 transition-colors">
              <LuShieldCheck
                size={28}
                className="text-gray-300 group-hover:text-red-500 transition-all"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
