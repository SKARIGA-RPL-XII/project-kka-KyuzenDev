import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await db.query("DELETE FROM user WHERE id = ?", [id]);

    return NextResponse.json(
      { message: "User berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data dari database" },
      { status: 500 },
    );
  }
}
