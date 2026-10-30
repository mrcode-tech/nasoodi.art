import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://nasoodi.art";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "nasoodi.art — A space for ideas",
    template: "%s | nasoodi.art",
  },
  description:
    "A digital space for creative ideas, thoughtful experiments, and things worth making.",
  applicationName: "nasoodi.art",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "nasoodi.art",
    title: "nasoodi.art — A space for ideas",
    description:
      "A digital space for creative ideas, thoughtful experiments, and things worth making.",
  },
  twitter: {
    card: "summary_large_image",
    title: "nasoodi.art — A space for ideas",
    description:
      "A digital space for creative ideas, thoughtful experiments, and things worth making.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
