import Link from "next/link";
import type { ReactNode } from "react";
export function Breadcrumb({ children, label }: { children: ReactNode; label: string }) {
  return <nav aria-label={label} className="breadcrumb-nav"><ol className="breadcrumb-list">{children}</ol></nav>;
}
export function BreadcrumbItem({ children, current = false }: { children: ReactNode; current?: boolean }) {
  return <li className="breadcrumb-item" aria-current={current ? "page" : undefined}>{children}</li>;
}
export function BreadcrumbLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="breadcrumb-link">{children}</Link>;
}
export function BreadcrumbPage({ children }: { children: ReactNode }) {
  return <span className="breadcrumb-current">{children}</span>;
}
export function BreadcrumbSeparator() { return <span className="breadcrumb-separator" aria-hidden="true">/</span>; }
