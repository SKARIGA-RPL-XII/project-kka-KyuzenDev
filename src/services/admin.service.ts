import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const getAdminStats = async () => {
  const [pasien] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM user WHERE role = 'Pasien'",
  );
  const [apoteker] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM user WHERE role = 'Apoteker'",
  );

  return {
    totalPasien: pasien[0]?.total || 0,
    totalApoteker: apoteker[0]?.total || 0,
  };
};
export const getAllUsers = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, nama, email, role, photo_profile FROM user ORDER BY createdAt DESC",
  );
  return rows;
};
