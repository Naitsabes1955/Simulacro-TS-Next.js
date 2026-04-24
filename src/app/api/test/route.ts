import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany();

        return NextResponse.json({
            success: true,
            message: "Conexión OK",
            data: users,
        });
    } catch (error) {
            return NextResponse.json({
            success: false,
            message: "Error de conexión",
            error: String(error),
        });
    }
}