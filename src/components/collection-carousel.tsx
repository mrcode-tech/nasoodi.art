"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselStatus } from "@/components/ui/carousel";
import { getGalleryCoverArtwork, pagePath, type Artwork, type Gallery, type Locale } from "@/lib/site";

type Props = { galleries: Gallery[]; artworks: Artwork[]; locale: Locale; label: string };

function CollectionLink({ gallery, artworks, locale }: { gallery: Gallery; artworks: Artwork[]; locale: Locale }) {
  const cover = getGalleryCoverArtwork(gallery, artworks, locale);
  return (
    <Link className="gallery-card" href={pagePath(locale, `galleries/${gallery.slug}`)}>
      {cover && <Image sizes="(max-width: 600px) 84vw, (max-width: 900px) 48vw, 32vw" src={cover.image.src} alt={cover.image.alt[locale] ?? ""} width={cover.image.width} height={cover.image.height} />}
      <span className="gallery-card-copy">
        <strong>{gallery.title[locale]}</strong>
        <span>{gallery.description[locale]}</span>
        <span className="gallery-card-action">{locale === "fa" ? "مشاهده مجموعه" : "Explore collection"} ↗</span>
      </span>
    </Link>
  );
}

export function CollectionCarousel({ galleries, artworks, locale, label }: Props) {
  if (galleries.length === 0) return null;
  if (galleries.length <= 2) {
    return <div className="gallery-cards gallery-cards-sparse">{galleries.map((gallery) => <CollectionLink key={gallery.id} gallery={gallery} artworks={artworks} locale={locale} />)}</div>;
  }
  const direction = locale === "fa" ? "rtl" : "ltr";
  return (
    <Carousel dir={direction} label={label} roleDescription={locale === "fa" ? "گالری مجموعه‌ها" : "carousel"} opts={{ slidesToScroll: 1 }} className="collection-carousel">
      <CarouselContent>
        {galleries.map((gallery, index) => (
          <CarouselItem key={gallery.id} aria-label={`${index + 1} ${locale === "fa" ? "از" : "of"} ${galleries.length}`}>
            <CollectionLink gallery={gallery} artworks={artworks} locale={locale} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="carousel-footer">
        <CarouselStatus label={locale === "fa" ? "موقعیت مجموعه‌ها" : "Collection position"} />
        <div className="carousel-controls">
          <CarouselPrevious label={locale === "fa" ? "مجموعه قبلی" : "Previous collection"} />
          <CarouselNext label={locale === "fa" ? "مجموعه بعدی" : "Next collection"} />
        </div>
      </div>
    </Carousel>
  );
}
