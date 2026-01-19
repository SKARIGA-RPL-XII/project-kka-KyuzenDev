export default function PasienPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
        <h3 className="font-bold text-lg mb-2 text-blue-600">Riwayat Resep</h3>
        <p className="text-sm text-gray-500">
          Lihat daftar obat yang pernah Anda beli.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
        <h3 className="font-bold text-lg mb-2 text-blue-600">Pesan Obat</h3>
        <p className="text-sm text-gray-500">
          Cari dan pesan obat dari apotek kami.
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
