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

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  const isProfilePage = pathname.includes("/profil");

  return {
    user,
    isMounted,
    isMenuOpen,
    setIsMenuOpen,
    dropdownRef,
    handleLogout,
    isProfilePage,
    router,
  };
}
