"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nama: string;
  role: "Pasien" | "Apoteker" | "Admin";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (!storedData) {
      router.push("/auth/login");
      return;
    }

    try {
      const data = JSON.parse(storedData);

      if (data && typeof data === "object" && "role" in data) {
        const parsedUser = data as User;
        setUser(parsedUser);
      } else {
        throw new Error("Struktur data tidak valid");
      }
    } catch (error) {
      console.error("Format data user salah", error);
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="animate-pulse font-medium text-gray-500">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SmartPharmacy</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {user.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-black">Halo, {user.nama}!</h2>
          <p className="text-gray-600">
            Selamat datang di panel kontrol SmartPharmacy.
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}