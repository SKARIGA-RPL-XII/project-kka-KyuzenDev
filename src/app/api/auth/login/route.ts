import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await AuthService.login(body);

    const response = NextResponse.json(
      { message: "Login berhasil", user: result.user },
      { status: 200 },
    );

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
