// src/utils/cookie.util.ts
import { NextResponse } from "next/server";

export const setAuthCookies = (response: NextResponse, accessToken: string, refreshToken: string) => {
  // Cookie para el Access Token (1 hora)
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, 
    path: "/",
  });

  // Cookie para el Refresh Token (7 días)
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 604800, // 7 días en segundos
    path: "/",
  });
};