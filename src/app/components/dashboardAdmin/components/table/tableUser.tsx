import Image from "next/image";
import { LuTrash2 } from "react-icons/lu";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  photo_profile: string;
}

interface TableUserProps {
  data: User[];
  handleRoleChange: (id: number, newRole: string, oldRole: string) => void;
  handleDelete: (id: number) => void;
}

export default function TableUser({
  data,
  handleRoleChange,
  handleDelete,
}: TableUserProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[13px] uppercase tracking-wider font-semibold">
            <th className="px-8 py-4 text-left">Pengguna</th>
            <th className="px-6 py-4 text-left">Hak Akses</th>
            <th className="px-8 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {data.length > 0 ? (
            data.map((user) => (
              <tr
                key={user.id}
                className="group hover:bg-red-50/30 transition-all duration-200"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full overflow-hidden relative border-2 border-white shadow-sm bg-gray-100 flex-shrink-0">
                      <Image
                        src={
                          user.photo_profile?.startsWith("data:image")
                            ? user.photo_profile
                            : "/dummy_user.png"
                        }
                        alt={user.nama}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 group-hover:text-red-700 transition-colors">
                        {user.nama}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="relative inline-block w-32">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value, user.role)
                      }
                      className={`w-full px-3 py-1.5 rounded-lg text-[11px] uppercase font-black tracking-widest border cursor-pointer outline-none appearance-none text-center transition-all ${
                        user.role === "Admin"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : user.role === "Apoteker"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      <option value="Pasien">Pasien</option>
                      <option value="Apoteker">Apoteker</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2.5 text-gray-400 cursor-pointer hover:text-white hover:bg-red-600 rounded-xl transition-all shadow-sm hover:shadow-red-200"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-12 text-center text-gray-400 italic"
              >
                Data pengguna tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
