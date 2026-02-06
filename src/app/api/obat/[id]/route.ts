import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID Obat tidak ditemukan" },
        { status: 400 },
      );
    }

    const query = "DELETE FROM obat WHERE id = ?";
    const [result] = await db.execute<ResultSetHeader>(query, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Obat tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Obat berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama_obat, kategori, stok, harga } = body;

    console.log("Mengupdate obat ID:", id, "dengan data:", body);

    const query =
      "UPDATE obat SET nama_obat = ?, kategori = ?, stok = ?, harga = ? WHERE id = ?";
    const [result] = await db.execute<ResultSetHeader>(query, [
      nama_obat,
      kategori,
      stok,
      harga,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Obat tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Obat berhasil diupdate" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}