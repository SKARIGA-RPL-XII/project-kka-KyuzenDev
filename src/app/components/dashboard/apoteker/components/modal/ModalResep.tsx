import Image from "next/image";
import {
  LuCalendarDays,
  LuUser,
  LuClipboard,
  LuImageOff,
} from "react-icons/lu";

interface ModalResepProps {
  isOpen: boolean;
  onClose: () => void;
  namaPasien: string;
  tanggal: string;
  keluhan: string;
  fotoResep: string | null;
}

export default function ModalResep({
  isOpen,
  onClose,
  namaPasien,
  tanggal,
  keluhan,
  fotoResep,
}: ModalResepProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Detail Resep</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <LuUser size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pasien</p>
              <p className="text-sm font-semibold text-gray-900">
                {namaPasien}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <LuCalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Tanggal Pesanan
              </p>
              <p className="text-sm font-semibold text-gray-900">{tanggal}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <LuClipboard size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Keluhan</p>
              <p className="text-sm text-gray-700 mt-1">{keluhan}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Foto Resep:
            </p>

            {fotoResep ? (
              <div className="border border-gray-200 rounded-2xl p-2 bg-gray-50">
                <Image
                  src={fotoResep}
                  alt={`Resep ${namaPasien}`}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl object-contain max-h-[400px]"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50 flex flex-col items-center justify-center text-center text-gray-500">
                <LuImageOff size={40} className="mb-2" />
                <p className="text-sm font-medium">Foto resep tidak tersedia</p>
                <p className="text-xs">Pasien tidak mengunggah foto resep.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 cursor-pointer bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}