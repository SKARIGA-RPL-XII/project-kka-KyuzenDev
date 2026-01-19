export default function ApotekerPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
        <h3 className="font-bold text-lg mb-2 text-green-600">Kelola Stok</h3>
        <p className="text-sm text-gray-500">
          Update jumlah dan harga obat-obatan.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
        <h3 className="font-bold text-lg mb-2 text-green-600">Pesanan Masuk</h3>
        <p className="text-sm text-gray-500">
          Verifikasi resep dan pesanan pasien.
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
