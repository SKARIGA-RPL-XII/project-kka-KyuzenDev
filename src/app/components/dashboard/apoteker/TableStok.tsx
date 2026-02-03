import { Obat } from "@/hooks/useObat";
import { LuChevronDown } from "react-icons/lu";

interface TableStokProps {
  data: Obat[];
}

export default function TableStok({ data }: TableStokProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 text-[13px] uppercase tracking-wider font-semibold bg-gray-50/50">
            <th className="px-8 py-4">Informasi Obat</th>
            <th className="px-6 py-4">Kategori</th>
            <th className="px-6 py-4">Status Stok</th>
            <th className="px-6 py-4">Harga Jual</th>
            <th className="px-8 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map(
            (
              item: Obat,
            ) => (
              <tr
                key={item.id}
                className="group hover:bg-emerald-50/30 transition-all duration-200"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 group-hover:text-emerald-700">
                      {item.nama_obat}
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: #SP-{item.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                    {item.kategori}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-extrabold ${item.stok < 10 ? "text-red-500" : "text-gray-700"}`}
                    >
                      {item.stok}
                    </span>
                    {item.stok < 10 ? (
                      <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md uppercase">
                        Kritis
                      </span>
                    ) : (
                      <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 font-semibold text-gray-700">
                  Rp {item.harga.toLocaleString("id-ID")}
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <LuChevronDown size={20} />
                  </button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
