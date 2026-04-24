import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    return NextResponse.json({ message: "Usuario creado", email: newUser.email }, { status: 201 });
  } catch (error: any) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ error: "Error en el servidor o usuario ya existe" }, { status: 500 });
  }
}