import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

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
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}