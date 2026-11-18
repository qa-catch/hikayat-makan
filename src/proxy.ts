import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tout sauf /api, /trpc, /_next, /_vercel et les fichiers (chemins avec un point).
  matcher: "/((?!api|trpc|_next|_vercel|.*\..*).*)",
};
