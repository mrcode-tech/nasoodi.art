import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// Keep the existing / -> /fa redirect owned by the root route.
// Only locale-prefixed application paths pass through next-intl.
export const config = {
  matcher: "/((?!$|api|trpc|_next|_vercel|.*\\..*).*)",
};
