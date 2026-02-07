import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    const query =
      "SELECT COUNT(*) as count FROM pesanan WHERE status = 'Menunggu Konfirmasi'";

    const [rows] = await db.execute(query);

    const count = (rows as Array<{ count: number }>)[0].count;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
