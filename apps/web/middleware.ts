export { auth as middleware } from "./auth"

export const config = {
  // Configurar las rutas que deben ejecutar el middleware
  matcher: ["/bookmarks", "/editor/:path*"],
}
