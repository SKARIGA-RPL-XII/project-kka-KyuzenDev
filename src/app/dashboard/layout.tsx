"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LuLogOut, LuChevronDown } from "react-icons/lu";
import Image from "next/image";

interface User {
  id: number;
  nama: string;
  role: "Pasien" | "Apoteker" | "Admin";
  photo_profile?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedData = localStorage.getItem("user");
      if (storedData) {
        try {
          const parsedUser = JSON.parse(storedData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data", error);
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
    };

    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);

    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(mountTimer);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  const isProfilePage = pathname.includes("/profil");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1
            className="text-xl font-bold text-blue-600 flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <span className="p-2 bg-blue-600 text-white rounded-lg">SP</span>
            SmartPharmacy
          </h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm overflow-hidden relative">
                {user.photo_profile ? (
                  <Image
                    src={user.photo_profile}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/dummy_user.png"
                    alt="Default Profile"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-none">
                  {user.nama}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user.role}</p>
              </div>
              <LuChevronDown
                className={`text-gray-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {user.nama}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {user.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 font-medium text-left"
                >
                  <LuLogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        {!isProfilePage && (
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Halo, {user.nama}
            </h2>
            <p className="text-gray-500">
              Selamat datang kembali di dashboard {user.role}.
            </p>
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
