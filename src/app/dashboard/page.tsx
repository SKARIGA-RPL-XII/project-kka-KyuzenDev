"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardDispatcher() {
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (!storedData) {
      router.push("/auth/login");
      return;
    }

    const user = JSON.parse(storedData);
    if (user.role === "Admin") router.replace("/dashboard/admin");
    else if (user.role === "Apoteker") router.replace("/dashboard/apoteker");
    else if (user.role === "Pasien") router.replace("/dashboard/pasien");
  }, [router]);

  return <p className="p-8">Redirecting to your dashboard...</p>;
}