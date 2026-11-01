import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { Locale } from "@/lib/site";
export type BreadcrumbEntry = { label: string; href?: string };
export function SiteBreadcrumbs({ locale, items }: { locale: Locale; items: BreadcrumbEntry[] }) {
  if (items.length < 2) return null;
  return <Breadcrumb label={locale === "fa" ? "مسیر صفحه" : "Breadcrumb"}>
    {items.map((item, index) => {
      const current = index === items.length - 1;
      return <BreadcrumbItem key={item.href ?? item.label} current={current}>
        {current || !item.href ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>}
        {!current && <BreadcrumbSeparator />}
      </BreadcrumbItem>;
    })}
  </Breadcrumb>;
}
