import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "smart_pharmacy_db",
    });

    const [rows] = await connection.execute("SELECT * FROM obat");
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_obat, kategori, stok, harga } = body;

    if (!nama_obat || !kategori || stok === undefined || harga === undefined) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    const query =
      "INSERT INTO obat (nama_obat, kategori, stok, harga) VALUES (?, ?, ?, ?)";
    const values = [nama_obat, kategori, Number(stok), Number(harga)];

    await db.execute(query, values);

    return NextResponse.json(
      { message: "Obat berhasil ditambahkan ke MySQL" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
