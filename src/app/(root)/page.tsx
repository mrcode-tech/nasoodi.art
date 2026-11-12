import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArtist } from "@/content/repositories/artist.repository";
import { getEntranceArtwork } from "@/content/repositories/site.repository";
import { primaryImageFor } from "@/lib/content/publication";
import { getPortfolioStructuredData } from "@/content/portfolio-structured-data";
import { serializeJsonLd } from "@/lib/seo/structured-data";
import { getTranslations } from "next-intl/server";
import { EntranceOverlayColorObserver } from "@/components/entrance-overlay-color-observer";

const siteOrigin = "https://nasoodi.art";

export function generateMetadata(): Metadata {
  const artist = getArtist("en");
  const artwork = getEntranceArtwork("en");
  const image = artwork ? primaryImageFor(artwork) : undefined;
  const title = artist?.name?.en ? `${artist.name.en} — Art Portfolio` : "Nasoodi.art — Art Portfolio";
  const description = artist?.shortIntroduction?.en ?? "Explore paintings and the artistic world of Nasoodi.art.";
  return {
    metadataBase: new URL(siteOrigin),
    applicationName: "Nasoodi.art",
    title,
    description,
    alternates: {
      canonical: siteOrigin + "/",
      languages: { en: siteOrigin + "/en", fa: siteOrigin + "/fa", "x-default": siteOrigin + "/" },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", title, description, url: siteOrigin + "/", siteName: "Nasoodi.art", locale: "en_US",
      ...(image ? { images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt.en ?? artwork?.title.en ?? artist?.name?.en ?? "Artwork" }] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image.src] } : {}) },
  };
}

export default async function RootPage() {
  const artist = getArtist("en");
  const artwork = getEntranceArtwork("en");
  const image = artwork ? primaryImageFor(artwork) : undefined;
  const t = await getTranslations({ locale: "en" });
  if (!artist?.name?.en) throw new Error("A published English artist profile is required for the entrance page.");
  const [firstName, ...remainingName] = artist.name.en.split(" ");
  const entranceFirstName = firstName === "Ghazaleh" ? "Ghazale" : firstName;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPortfolioStructuredData("en")) }} />
      <main className="entrance-page">
        <EntranceOverlayColorObserver />
        <div className="entrance-content">
          <div className="entrance-stage">
          {image && (
                <div className="entrance-artwork-frame">
                  <Image className="entrance-artwork" src={image.src} alt={image.alt.en ?? artwork?.title.en ?? artist.name.en}
                    width={image.width} height={image.height}
                    sizes="(max-width: 640px) 94vw, (max-width: 1200px) 90vw, 1100px" priority />
                </div>
          )}
            <section className="entrance-copy" aria-label={t("entranceIntroduction")}>
            <h1><span className="entrance-name-first">{entranceFirstName}</span><span className="entrance-name-rest">{remainingName.join(" ")}</span></h1>
            <p className="entrance-welcome">{t("welcomeMessage")}</p>
            <nav className="entrance-language-links" aria-label={t("chooseLanguage")}>
              <Link href="/en">{t("enterEnglish")}</Link>
              <Link href="/fa" lang="fa" dir="rtl">{t("enterPersian")}</Link>
            </nav>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
