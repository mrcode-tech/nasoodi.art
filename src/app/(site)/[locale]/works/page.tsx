import { ArtworkIndex } from "@/components/artwork-index";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { getArtworks } from "@/content/repositories/artwork.repository";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? getSectionMetadata("works", locale) : {};
}

export default async function WorksPage({ params, searchParams }: Props) {
  const [{ locale }] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const items = getArtworks(locale);

  return (
    <div className="page-content">
      <SiteBreadcrumbs
        locale={locale}
        items={[
          { label: t("home"), href: pagePath(locale) },
          { label: t("selected") },
        ]}
      />
      <header className="page-heading">
        <p className="eyebrow">{t("portfolio")}</p>
        <h1>{t("works")}</h1>
        <p>{t("selectedIntro")}</p>
      </header>
      {items.length === 0 ? (
        <p className="empty-note">{t("emptyWorks")}</p>
      ) : (
        <ArtworkIndex
          artworks={items}
          locale={locale}
          labels={{
            itemsPerPage: t("itemsPerPage"),
            previous: t("previousPage"),
            next: t("nextPage"),
            page: t("galleryPage"),
          }}
        />
      )}
    </div>
  );
}
