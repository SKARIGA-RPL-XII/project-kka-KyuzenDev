import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verifikasi token untuk mendapatkan apoteker_id
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    const apotekerId = decoded.id;

    const body = await request.json();
    const { id, status, harga_total, konsultasi_apoteker, detail_pesanan } =
      body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID pesanan dan status wajib diisi" },
        { status: 400 },
      );
    }

    if (status === "Diproses") {
      const query = `
        UPDATE pesanan 
        SET status = ?, apoteker_id = ? 
        WHERE id = ? AND status = 'Menunggu Konfirmasi'
      `;
      await db.execute(query, [status, apotekerId, id]);

      return NextResponse.json(
        { message: "Pesanan berhasil diproses" },
        { status: 200 },
      );
    }

    if (status === "Selesai") {
      if (!harga_total || !detail_pesanan || detail_pesanan.length === 0) {
        return NextResponse.json(
          { error: "Data pesanan tidak lengkap (harga/item obat wajib diisi)" },
          { status: 400 },
        );
      }

      await db.query("START TRANSACTION");

      try {
        const updatePesananQuery = `
          UPDATE pesanan 
          SET status = ?, harga_total = ?, konsultasi_apoteker = ?, apoteker_id = ? 
          WHERE id = ? AND status = 'Diproses'
        `;
        await db.execute(updatePesananQuery, [
          status,
          harga_total,
          konsultasi_apoteker,
          apotekerId,
          id,
        ]);

        for (const item of detail_pesanan) {
          const insertDetailQuery = `
            INSERT INTO detail_pesanan (pesanan_id, obat_id, jumlah, subtotal)
            VALUES (?, ?, ?, ?)
          `;
          await db.execute(insertDetailQuery, [
            id,
            item.obat_id,
            item.jumlah,
            item.subtotal,
          ]);

          const updateStokQuery = `
            UPDATE obat 
            SET stok = stok - ? 
            WHERE id = ? AND stok >= ?
          `;
          const [result] = await db.execute<ResultSetHeader>(updateStokQuery, [
            item.jumlah,
            item.obat_id,
            item.jumlah,
          ]);

          if (result.affectedRows === 0) {
            throw new Error(
              `Stok tidak mencukupi untuk obat ID: ${item.obat_id}`,
            );
          }
        }

        await db.query("COMMIT");

        return NextResponse.json(
          { message: "Pesanan selesai dan stok diperbarui" },
          { status: 200 },
        );
      } catch (error) {
        await db.query("ROLLBACK");
        console.error("Transaction Error:", error);
        return NextResponse.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "Gagal menyelesaikan pesanan",
          },
          { status: 500 },
        );
      }
    }

    if (status === "Dibatalkan") {
      const query = `UPDATE pesanan SET status = ? WHERE id = ?`;
      await db.execute(query, [status, id]);
      return NextResponse.json(
        { message: "Pesanan berhasil dibatalkan" },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
