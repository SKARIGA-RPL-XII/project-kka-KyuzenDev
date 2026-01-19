import { RowDataPacket } from "mysql2";

export interface UserRow extends RowDataPacket {
  id: number;
  nama: string;
  email: string;
  role: "Pasien" | "Apoteker" | "Admin";
}
