"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselStatus } from "@/components/ui/carousel";
import { getGalleryCoverArtwork } from "@/lib/content/publication";
import { getLocalizedSlug } from "@/lib/content/paths";
import { pagePath, getLocaleDirection, type Locale } from "@/types/locale";
import type { Artwork, Gallery } from "@/types/content";

type Props = { galleries: Gallery[]; artworks: Artwork[]; locale: Locale; label: string };

function CollectionLink({ gallery, artworks, locale }: { gallery: Gallery; artworks: Artwork[]; locale: Locale }) {
  const t = useTranslations();
  const cover = getGalleryCoverArtwork(gallery, artworks, locale);
  return (
    <Link className="gallery-card" href={pagePath(locale, `galleries/${getLocalizedSlug(gallery, locale)}`)}>
      {cover && <Image sizes="(max-width: 600px) 84vw, (max-width: 900px) 48vw, 32vw" src={cover.image.src} alt={cover.image.alt[locale] ?? ""} width={cover.image.width} height={cover.image.height} />}
      <span className="gallery-card-copy">
        <strong>{gallery.title[locale]}</strong>
        <span>{gallery.description[locale]}</span>
        <span className="gallery-card-action">{t("exploreCollection")} ↗</span>
      </span>
    </Link>
  );
}

export function CollectionCarousel({ galleries, artworks, locale, label }: Props) {
  const t = useTranslations();
  if (galleries.length === 0) return null;
  if (galleries.length <= 2) {
    return <div className="gallery-cards gallery-cards-sparse">{galleries.map((gallery) => <CollectionLink key={gallery.id} gallery={gallery} artworks={artworks} locale={locale} />)}</div>;
  }
  const direction = getLocaleDirection(locale);
  return (
    <Carousel dir={direction} label={label} roleDescription={t("carouselRole")} opts={{ slidesToScroll: 1 }} className="collection-carousel">
      <CarouselContent>
        {galleries.map((gallery, index) => (
          <CarouselItem key={gallery.id} aria-label={`${index + 1} ${t("of")} ${galleries.length}`}>
            <CollectionLink gallery={gallery} artworks={artworks} locale={locale} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="carousel-footer">
        <CarouselStatus label={t("collectionPosition")} />
        <div className="carousel-controls">
          <CarouselPrevious label={t("previousCollection")} />
          <CarouselNext label={t("nextCollection")} />
        </div>
      </div>
    </Carousel>
  );
}
