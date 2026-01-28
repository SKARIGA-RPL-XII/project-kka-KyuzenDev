"use client";
import { useState, useEffect, useCallback } from "react";
import { UserRow } from "@/types/user";
import { useRouter } from "next/navigation";

export function useAdmin() {
    const [view, setView] = useState<"menu" | "panel" | "users">("menu");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalPasien: 0, totalApoteker: 0 });
    const [users, setUsers] = useState<UserRow[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/stats");
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setStats(data.stats);
            setUsers(data.users as UserRow[]);
        } catch (error) {
            console.error("Gagal memuat data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        if (!storedData) {
            router.push("/auth/login");
            return;
        }
        const user = JSON.parse(storedData);
        if (user.role !== "Admin") {
            if (user.role === "Apoteker") router.replace("/dashboard/apoteker");
            else if (user.role === "Pasien") router.replace("/dashboard/pasien");
        }
    }, [router]);

    useEffect(() => {
        fetchData();
        setCurrentPage(1);
    }, [fetchData, searchTerm, roleFilter]);

    const handleDelete = async (id: number) => {
        const storedData = localStorage.getItem("user");
        const currentUser = storedData ? JSON.parse(storedData) : null;

        if (currentUser?.id === id) {
            alert("Bahaya! Anda tidak dapat menghapus akun Anda sendiri.");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            try {
                const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
                if (response.ok) {
                    fetchData();
                    alert("User berhasil dihapus.");
                }
            } catch (error) {
                console.error("Gagal menghapus:", error);
            }
        }
    };

    const handleRoleChange = async (userId: number, newRole: string, currentRole: string) => {
        if (newRole === currentRole) return;
        const storedData = localStorage.getItem("user");
        const currentUser = storedData ? JSON.parse(storedData) : null;

        if (currentUser?.id === userId && newRole !== "Admin") {
            alert("Anda tidak dapat mengubah role akun Anda sendiri.");
            return;
        }

        if (newRole === "Admin" && !confirm("Ubah role user ini menjadi Admin?")) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (roleFilter === "All" || u.role === roleFilter)
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
        view, setView, loading, stats, currentItems, searchTerm, setSearchTerm,
        roleFilter, setRoleFilter, currentPage, setCurrentPage, totalPages,
        handleDelete, handleRoleChange, filteredUsersCount: filteredUsers.length
    };
}