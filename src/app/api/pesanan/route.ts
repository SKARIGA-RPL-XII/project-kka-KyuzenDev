import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    const userId = decoded.id;

    const formData = await request.formData();
    const keluhan = formData.get("keluhan") as string;
    const total_harga = formData.get("total_harga") as string;
    const foto_resep_file = formData.get("foto_resep") as File | null;

    let fotoUrlPath = null;

    if (foto_resep_file && foto_resep_file.size > 0) {
      const bytes = await foto_resep_file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}_${foto_resep_file.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      await writeFile(path.join(uploadDir, filename), buffer);

      fotoUrlPath = `/uploads/${filename}`;
    }

    const [result] = await db.execute(
      "INSERT INTO pesanan (user_id, keluhan, foto_resep, total_harga) VALUES (?, ?, ?, ?)",
      [userId, keluhan, fotoUrlPath, total_harga || 0],
    );

    return NextResponse.json(
      { message: "Pesanan berhasil dibuat", data: result },
      { status: 201 },
    );
  } catch (error) {
    console.error("DETAIL ERROR PESANAN:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = `
      SELECT p.*, u.nama as nama_pasien 
      FROM pesanan p
      JOIN user u ON p.user_id = u.id
    `;
    const queryParams = [];

    if (status && status !== "Semua") {
      query += ` WHERE p.status = ?`;
      queryParams.push(status);
    }

    query += ` ORDER BY p.createdAt DESC`;

    const [rows] = await db.execute(query, queryParams);

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
