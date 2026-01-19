export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm cursor-pointer border border-red-200 hover:shadow-md transition">
        <h3 className="font-bold text-lg mb-2 text-red-600">Panel Admin</h3>
        <p className="text-sm text-gray-500">
          Kelola semua user, apoteker, dan laporan sistem.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
        <h3 className="font-bold text-lg mb-2 text-gray-700">Profil Saya</h3>
        <p className="text-sm text-gray-500">
          Ubah data diri dan ganti password.
        </p>
      </div>
    </div>
  );
}