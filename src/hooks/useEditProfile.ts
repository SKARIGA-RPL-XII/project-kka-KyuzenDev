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
  const [showPassword, setShowPassword] = useState(false);
  
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
     reader.onload = (event) => {
       const img = new Image();
       img.src = event.target?.result as string;
       img.onload = () => {
         const canvas = document.createElement("canvas");
         const MAX_WIDTH = 200;
         const scaleSize = MAX_WIDTH / img.width;
         canvas.width = MAX_WIDTH;
         canvas.height = img.height * scaleSize;

         const ctx = canvas.getContext("2d");
         ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

         const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
         setPreviewImage(compressedBase64);
       };
     };
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
          photo_profile: previewImage,
        }),
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          nama: formData.nama,
          email: formData.email,
          photo_profile: previewImage,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        const allUsersData = localStorage.getItem("users");
        if (allUsersData) {
          const allUsers = JSON.parse(allUsersData);
          const updatedUsersList = allUsers.map((u: User) =>
            u.id === user?.id ? { ...u, ...updatedUser } : u,
          );
          localStorage.setItem("users", JSON.stringify(updatedUsersList));
        }

        window.dispatchEvent(new Event("storage"));
        alert("Profil Berhasil Diperbarui!");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
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
    showPassword,
    setShowPassword,
  };
}
