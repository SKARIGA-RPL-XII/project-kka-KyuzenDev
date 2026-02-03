"use client";
import { useAdmin } from "@/hooks/useAdmin";
import Link from "next/link";
import {
  LuArrowLeft,
  LuUsers,
  LuShieldCheck,
  LuChevronRight,
} from "react-icons/lu";

interface StatCardProps {
  label: string;
  value: number;
  color: "blue" | "emerald" | "red";
  icon: React.ReactNode;
}

export default function StatsPage() {
  const { stats, loading } = useAdmin();

  if (loading)
    return <div className="p-20 text-center">Memuat Statistik...</div>;

  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin"
          className="p-2.5 bg-white border text-gray-600 border-gray-200 hover:text-red-600 rounded-xl transition-all shadow-sm"
        >
          <LuArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Dashboard Statistik
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          label="Total Pasien"
          value={stats.totalPasien}
          color="blue"
          icon={<LuUsers size={24} />}
        />
        <StatCard
          label="Total Apoteker"
          value={stats.totalApoteker}
          color="emerald"
          icon={<LuShieldCheck size={24} />}
        />
      </div>

      <Link href="/dashboard/admin/users">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-400 transition-all flex justify-between items-center group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <LuUsers size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Manajemen Pengguna
              </h3>
              <p className="text-sm text-gray-500">
                Ubah peran, hapus akun, atau verifikasi identitas.
              </p>
            </div>
          </div>
          <LuChevronRight
            className="text-gray-300 group-hover:text-blue-600 transition-all"
            size={24}
          />
        </div>
      </Link>
    </div>
  );
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}