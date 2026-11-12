import { useTranslations } from "next-intl";
import type { PublicContactDetails } from "@/lib/content/publication";
import type { Locale } from "@/types/locale";

type HomepageContactFooterProps = {
  locale: Locale;
  details?: PublicContactDetails;
};

function GmailIcon() {
  return (
    <svg className="homepage-contact-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M3.2 6.4v11.2c0 .8.6 1.4 1.4 1.4h2.1V9.1L12 13l5.3-3.9V19h2.1c.8 0 1.4-.6 1.4-1.4V6.4c0-1.2-1.4-1.9-2.4-1.2L12 10 5.6 5.2c-1-.7-2.4 0-2.4 1.2Z" />
      <path fill="#EA4335" d="m4.1 5.3 7.9 5.9 7.9-5.9c-.5-.4-1.2-.4-1.7 0L12 9.6 5.8 5.3c-.5-.4-1.2-.4-1.7 0Z" />
      <path fill="#34A853" d="M17.3 9.1V19h2.1c.8 0 1.4-.6 1.4-1.4V7.4l-3.5 1.7Z" />
      <path fill="#FBBC04" d="M3.2 7.4v10.2c0 .8.6 1.4 1.4 1.4h2.1V9.1L3.2 7.4Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="homepage-contact-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" fill="#229ED9" />
      <path fill="#fff" d="m5.2 11.6 12.1-4.7c.6-.2 1.1.2.9.9l-2.1 9.8c-.1.7-.6.8-1.1.5l-3.2-2.4-1.6 1.6c-.2.2-.4.4-.8.4l.2-3.3 6.1-5.5c.3-.2-.1-.4-.4-.2l-7.5 4.7-3.2-1c-.7-.2-.7-.7.6-1.2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="homepage-contact-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="homepage-instagram-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEDA75" />
          <stop offset=".45" stopColor="#FA7E1E" />
          <stop offset=".72" stopColor="#D62976" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="url(#homepage-instagram-gradient)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="url(#homepage-instagram-gradient)" strokeWidth="2" />
      <circle cx="17.5" cy="6.8" r="1.2" fill="#D62976" />
    </svg>
  );
}

export function HomepageContactFooter({ locale, details }: HomepageContactFooterProps) {
  const t = useTranslations();

  if (!details?.email || !details.telegramUrl || !details.telegramHandle || !details.instagramUrl || !details.instagramHandle) {
    return null;
  }

  return (
    <section
      className="homepage-contact-footer"
      aria-labelledby="homepage-contact-footer-title"
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <div className="homepage-contact-footer-inner">
        <h2 id="homepage-contact-footer-title">{t("homepageContactHeading")}</h2>
        <ul className="homepage-contact-links" aria-label={t("contact")}>
          <li>
            <a className="homepage-contact-link" href={"mailto:" + details.email} aria-label={t("sendEmail")}>
              <GmailIcon />
              <span className="homepage-contact-identifier" dir="ltr">{details.email}</span>
            </a>
          </li>
          <li>
            <a className="homepage-contact-link" href={details.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label={t("contactOnTelegram")}>
              <TelegramIcon />
              <span className="homepage-contact-identifier" dir="ltr">@{details.telegramHandle}</span>
            </a>
          </li>
          <li>
            <a className="homepage-contact-link" href={details.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={t("visitInstagram")}>
              <InstagramIcon />
              <span className="homepage-contact-identifier" dir="ltr">@{details.instagramHandle}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
