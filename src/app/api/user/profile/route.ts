import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id, nama, email, photo_profile } = await request.json();

    await db.query(
      "UPDATE user SET nama = ?, email = ?, photo_profile = ? WHERE id = ?",
      [nama, email, photo_profile, id],
    );

    return NextResponse.json(
      { message: "Berhasil update database" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database Error:", error);

    return NextResponse.json(
      { message: "Gagal update database" },
      { status: 500 },
    );
  }
}
