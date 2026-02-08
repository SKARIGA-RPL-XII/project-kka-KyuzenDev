import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
interface NotifResult {
  unreadCount: number;
}
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };
    const currentUserId = decoded.id;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // --- QUERY DATA PESANAN ---
    let query = `
      SELECT 
        p.id,
        p.user_id,
        p.keluhan,
        p.foto_resep,
        p.createdAt,
        p.harga_total,
        p.apoteker_id,
        -- LOGIKA UBAH STATUS DI SINI
        CASE 
          WHEN p.status = 'Selesai' THEN 'Siap Di Ambil'
          ELSE p.status
        END as status,
        a.nama as nama_apoteker,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'nama_obat', o.nama_obat,
              'jumlah', dp.jumlah,
              'subtotal', dp.subtotal
            )
          )
          FROM detail_pesanan dp
          JOIN obat o ON dp.obat_id = o.id
          WHERE dp.pesanan_id = p.id
        ) as detail_obat
      FROM pesanan p
      LEFT JOIN user a ON p.apoteker_id = a.id
      WHERE p.user_id = ?
    `;

    const queryParams: (string | number)[] = [currentUserId];

    if (status) {
      // Jika frontend memfilter 'Siap Di Ambil', SQL mencari status asli 'Selesai'
      if (status === "Siap Di Ambil") {
        query += ` AND p.status = 'Selesai'`;
      } else {
        query += ` AND p.status = ?`;
        queryParams.push(status);
      }
    }

    query += ` ORDER BY p.createdAt DESC`;

    const [rows] = await db.execute(query, queryParams);

    // --- QUERY HITUNG NOTIFIKASI ---
    // Hitung berapa banyak pesanan yang berstatus 'Selesai' (label: "Siap Di Ambil")
    const notifQuery = `
      SELECT COUNT(*) as unreadCount
      FROM pesanan
      WHERE user_id = ? AND status = 'Selesai'
    `;
    const [notifResult] = await db.execute(notifQuery, [currentUserId]);
    const unreadCount = (notifResult as NotifResult[])[0].unreadCount;
    return NextResponse.json(
      {
        data: rows,
        unreadCount: unreadCount, // Kirim jumlah notifikasi ke frontend
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    const currentUserId = decoded.id;

    // LOGIKA: Ubah status dari 'Selesai' menjadi 'Diambil'
    // Sehingga tidak terhitung lagi sebagai notifikasi
    const updateQuery = `
      UPDATE pesanan 
      SET status = 'Diambil' 
      WHERE user_id = ? AND status = 'Selesai'
    `;

    await db.execute(updateQuery, [currentUserId]);

    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}