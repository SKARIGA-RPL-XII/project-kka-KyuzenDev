import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface RegisterInput {
  nama: string;
  email: string;
  password: string;
  role: "Pasien" | "Apoteker";
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterInput) {
    const { nama, email, password, role } = data;

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM User WHERE email = ?",
      [email],
    );

    if (rows.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO User (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, hashedPassword, role],
    );

    return {
      id: result.insertId,
      nama,
      email,
      role,
    };
  }

  static async login(data: LoginInput) {
    const { email, password } = data;

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM User WHERE email = ?",
      [email],
    );

    const user = rows[0];
    if (!user) throw new Error("Email atau password salah");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Email atau password salah");

    let imageBase64 = null;

    if (user.photo_profile && Buffer.isBuffer(user.photo_profile)) {
      imageBase64 = `data:image/jpeg;base64,${user.photo_profile.toString("base64")}`;
    } else if (typeof user.photo_profile === "string") {
      imageBase64 = user.photo_profile.startsWith("data:")
        ? user.photo_profile
        : `data:image/jpeg;base64,${user.photo_profile}`;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        role: user.role,
        photo_profile: imageBase64,
      },
    };
  }
}
