"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LuCamera, LuSave } from "react-icons/lu";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  photo_profile?: string;
}

export default function EditProfilPage() {
  const router = useRouter();

  const [user] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("user");
      return storedData ? JSON.parse(storedData) : null;
    }
    return null;
  });

  const [formData, setFormData] = useState({
    nama: user?.nama || "",
    email: user?.email || "",
    password: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.photo_profile || null,
  );

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (user?.role === "Admin") router.push("/dashboard/admin");
    else if (user?.role === "Apoteker") router.push("/dashboard/apoteker");
    else router.push("/dashboard/pasien");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          nama: formData.nama,
          email: formData.email,
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
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 pt-8 pb-2 border-b border-gray-50 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Profil</h1>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-6">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative group">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md overflow-hidden relative">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                user.nama.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all z-10">
              <LuCamera className="text-blue-600" size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-xs text-gray-400">
            Klik ikon kamera untuk ubah foto
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              className="w-full p-3 text-gray-400 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru (Opsional)
            </label>
            <input
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 p-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LuSave size={20} /> Simpan
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 p-3 rounded-xl bg-gray-200 font-bold text-gray-600 hover:bg-gray-300 transition-all border border-gray-100 cursor-pointer"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
