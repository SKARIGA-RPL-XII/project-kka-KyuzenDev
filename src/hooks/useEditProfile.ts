"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  photo_profile?: string;
}

export function useEditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (!storedData) {
      router.push("/auth/login");
    } else {
      const parsedUser = JSON.parse(storedData);
      setUser(parsedUser);
      setFormData({
        nama: parsedUser.nama,
        email: parsedUser.email,
        password: "",
      });
      setPreviewImage(parsedUser.photo_profile || null);
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    const routes: Record<string, string> = {
      Admin: "/dashboard/admin",
      Apoteker: "/dashboard/apoteker",
      Pasien: "/dashboard/pasien",
    };
    router.push(routes[user.role] || "/dashboard");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          nama: formData.nama,
          email: formData.email,
          password: formData.password || undefined, // Kirim password jika diisi
          photo_profile: previewImage,
        }),
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          nama: formData.nama,
          photo_profile: previewImage,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));
        alert("Profil berhasil diperbarui!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    formData,
    setFormData,
    previewImage,
    handleImageChange,
    handleCancel,
    handleSave,
    loading,
  };
}
