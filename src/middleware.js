// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const session = req.cookies.get("session_token")?.value;

  // Si no hay sesión, redirige a /sign-in
  if (!session) {
    // Evita loop si ya está en rutas públicas
    const publicPaths = ["/sign-in", "/sign-up", "/public"];
    const isPublic = publicPaths.some((p) => url.pathname.startsWith(p));

    // if (!isPublic) {
    //   const signInUrl = url.clone();
    //   signInUrl.pathname = "/sign-in";
    //   // opcional: pasa redirect param
    //   signInUrl.searchParams.set("from", url.pathname);
    //   return NextResponse.redirect(signInUrl);
    // }
  }

  // Con sesión (o en ruta pública): continuar
  return NextResponse.next();
}

// Define qué rutas afecta el middleware (excluye assets y API públicas)
export const config = {
  matcher: [
    // todo menos _next, estáticos y favicon
    "/((?!_next/|static/|favicon.ico).*)",
  ],
};