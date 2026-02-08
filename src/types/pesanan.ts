export interface ObatItem {
  jumlah: number;
  subtotal: number | string;
  nama_obat: string;
}

export interface Pesanan {
  id: number;
  user_id: number;
  keluhan: string;
  foto_resep: string | null;
  status: string;
  createdAt: string;
  harga_total: number | string;
  nama_apoteker?: string | null;
  detail_obat?: ObatItem[] | string | null;
}
