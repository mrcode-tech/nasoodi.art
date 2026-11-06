import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumb({ children, label, dir }: { children: ReactNode; label: string; dir?: "ltr" | "rtl" }) {
  return (
    <nav dir={dir} aria-label={label} className="breadcrumb-nav">
      <ol className="breadcrumb-list">{children}</ol>
    </nav>
  );
}

export function BreadcrumbItem({ children }: { children: ReactNode; current?: boolean }) {
  return <li className="breadcrumb-item">{children}</li>;
}

export function BreadcrumbLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="breadcrumb-link">{children}</Link>;
}

export function BreadcrumbPage({ children }: { children: ReactNode }) {
  return <span className="breadcrumb-current" aria-current="page">{children}</span>;
}

export function BreadcrumbSeparator() {
  return <span className="breadcrumb-separator" aria-hidden="true">/</span>;
}
