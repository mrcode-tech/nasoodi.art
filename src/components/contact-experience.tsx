import { useTranslations } from "next-intl";
import type { Locale, PublicContactDetails } from "@/lib/site";

type ContactExperienceProps = {
  locale: Locale;
  details?: PublicContactDetails;
  variant: "home" | "page";
};

export function ContactExperience({ locale, details, variant }: ContactExperienceProps) {
  const t = useTranslations();
  const titleId = variant === "home" ? "homepage-contact-title" : "contact-page-title";
  const Heading = variant === "home" ? "h2" : "h1";
  const hasMethods = Boolean(details && (details.email || details.instagramUrl || details.telegramUrl));

  return (
    <section
      className={"contact-experience contact-experience-" + variant + (variant === "home" ? " homepage-contact" : "")}
      aria-labelledby={titleId}
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <div className="contact-composition">
        <div className="contact-introduction">
          <p className="eyebrow">{t("contact")}</p>
          <Heading className={"contact-title contact-title-" + variant} id={titleId}>
            {t("contactHeading")}
          </Heading>
          <p className="contact-intro">{t("contactIntro")}</p>
        </div>
        <div className="contact-details">
          {hasMethods ? (
            <ul className="contact-methods" aria-label={t("contact")}>
              {details?.email && (
                <li className="contact-method">
                  <span className="contact-method-label">{t("email")}</span>
                  <a href={"mailto:" + details.email} dir="ltr">{details.email}</a>
                </li>
              )}
              {details?.instagramUrl && details.instagramHandle && (
                <li className="contact-method">
                  <span className="contact-method-label">{t("instagram")}</span>
                  <a href={details.instagramUrl} target="_blank" rel="noopener noreferrer" dir="ltr">
                    @{details.instagramHandle}
                  </a>
                </li>
              )}
              {details?.telegramUrl && details.telegramHandle && (
                <li className="contact-method">
                  <span className="contact-method-label">{t("telegram")}</span>
                  <a href={details.telegramUrl} target="_blank" rel="noopener noreferrer" dir="ltr">
                    @{details.telegramHandle}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="contact-pending" role="status">{t("contactPending")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
