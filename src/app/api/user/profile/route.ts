import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id, nama, email, photo_profile } = await request.json();

    let finalPhoto = photo_profile;

    if (photo_profile && photo_profile.includes("base64")) {
      const base64Data = photo_profile.split(",")[1];
      finalPhoto = Buffer.from(base64Data, "base64");
    }

    await db.query(
      "UPDATE user SET nama = ?, email = ?, photo_profile = ? WHERE id = ?",
      [nama, email, finalPhoto, id],
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
