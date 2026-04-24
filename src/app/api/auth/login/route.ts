import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, generateToken } from "@/services/auth.register.service";
import { setAuthCookies } from "@/utils/cookie.util";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Buscar al usuario por email
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    // 2. Si no existe o la contraseña no coincide, error 401 (Unauthorized)
    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { success: false, message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // 3. Verificar que el usuario esté activo (Requisito del simulacro)
    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Tu cuenta no está activa. Contacta a un administrador." },
        { status: 403 }
      );
    }

    // 4. Generar los Tokens (Access y Refresh)
    const accessToken = generateToken({ userId: user.id, role: user.role });
    
    // Aquí podrías generar el Refresh Token si ya lo añadiste al service
    // const refreshToken = generateRefreshToken({ userId: user.id });

    // 5. Crear la respuesta y adjuntar las HttpOnly Cookies
    const response = NextResponse.json({
      success: true,
      message: "Login exitoso",
      user: {
        email: user.email,
        role: user.role,
        id: user.id
      }
    });

    // Usamos el utilitario para que las cookies sean seguras
    // Si aún no tienes refreshToken, puedes pasar un string vacío o ajustar el util
    setAuthCookies(response, accessToken, "token_de_refresco_pendiente");

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}