import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { role } = await request.json();

    // UNWRAP PARAMS DI SINI:
    const { id } = await params;

    await db.query("UPDATE user SET role = ? WHERE id = ?", [role, id]);

    return NextResponse.json({ message: "Role updated" }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
