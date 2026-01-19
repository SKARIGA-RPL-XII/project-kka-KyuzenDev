import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const getAdminStats = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM users",
  );

  return {
    totalUsers: rows[0]?.total || 0,
  };
};

export const getAllUsers = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, nama, email, role FROM users ORDER BY created_at DESC",
  );
  return rows;
};
