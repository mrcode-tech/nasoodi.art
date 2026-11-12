import { ThemeProvider } from "@/components/providers/theme-provider";
import "../globals.css";
import "../entrance.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="entrance-document" suppressHydrationWarning>
      <body className="entrance-document-body"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
