import { NextResponse } from "next/server";
import { getAdminStats, getAllUsers } from "@/services/admin.service";

export async function GET() {
  try {
    const [stats, users] = await Promise.all([getAdminStats(), getAllUsers()]);

    return NextResponse.json({ stats, users }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
