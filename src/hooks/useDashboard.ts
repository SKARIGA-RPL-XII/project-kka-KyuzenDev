"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  nama: string;
  role: "Pasien" | "Apoteker" | "Admin";
  photo_profile?: string;
}

export function useDashboard() {
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
          setUser(JSON.parse(storedData));
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

    const mountTimer = setTimeout(() => setIsMounted(true), 0);

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

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/auth/login");
        router.refresh();
      } else {
        console.error("Gagal melakukan logout");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  const isProfilePage = pathname.includes("/profil");
  const isStokPage = pathname.includes("/stok");
  const isStatsPage = pathname.includes("/stats");
  const isUsersPage = pathname.includes("/users");
  const isPesananMasukPage = pathname.includes("/pesanan-masuk");

  return {
    user,
    isMounted,
    isMenuOpen,
    setIsMenuOpen,
    dropdownRef,
    handleLogout,
    isProfilePage,
    isStatsPage,
    isUsersPage,
    isStokPage,
    isPesananMasukPage,
    router,
  };
}
