import { defaultLocale, getLocaleDirection } from "@/types/locale";

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang={defaultLocale} dir={getLocaleDirection(defaultLocale)}><body>{children}</body></html>}