import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID pesanan dan status wajib diisi" },
        { status: 400 }
      );
    }

    const query = "UPDATE pesanan SET status = ? WHERE id = ?";
    await db.execute(query, [status, id]);

    return NextResponse.json(
      { message: "Status pesanan berhasil diperbarui" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}