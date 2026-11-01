import { approvedArtworkImageDimensions } from "./approved-artwork-image-dimensions";
export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (v: string): v is Locale => locales.includes(v as Locale);

export const otherLocale = (l: Locale): Locale => l === "fa" ? "en" : "fa";
export const pagePath = (l: Locale, p = "") => `/${l}${p ? `/${p.replace(/^\/+/, "")}` : ""}`;
export type Localized = Partial<Record<Locale, string>>;
export type Status = "draft" | "scheduled" | "needs-review" | "approved" | "published" | "archived";
export type ImageRecord = { src: string; alt: Localized; role: "primary" | "detail" | "installation"; width: number; height: number };
export type Artwork = { id: string; slug: string; title: Localized; images: ImageRecord[]; rightsConfirmed: boolean; status: Status; year?: number; medium?: Localized; description?: Localized; sortOrder?: number };
export type Gallery = { id: string; slug: string; title: Localized; description: Localized; coverArtworkId: string; artworkIds: string[]; status: Status; sortOrder: number };
export type JournalEvent = { startsAt: string; endsAt?: string; timeZone: string; venue?: Localized; attendanceMode?: "in-person" | "online" | "hybrid"; registrationUrl?: string };
export type JournalCategory = "exhibition" | "event" | "studio-update" | "story";
export type JournalTextBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "link"; text: string; href: string };
export type LocalizedRichText = Partial<Record<Locale, JournalTextBlock[]>>;
export type JournalEntry = { id: string; slug: string; type: JournalCategory; title: Localized; summary: Localized; body?: LocalizedRichText; coverImage?: { src: string; alt: Localized; width: number; height: number; rightsConfirmed: boolean }; status: Status; publishedAt?: string; approvedLocales: Locale[]; artistApproved: boolean; event?: JournalEvent };
export function isSafeJournalHref(href: string): boolean {
  if (!href || href.includes("\\") || /[\u0000-\u001f]/.test(href)) return false;
  if (href.startsWith("/") && !href.startsWith("//")) {
    try { return new URL(href, "https://nasoodi.art").origin === "https://nasoodi.art"; }
    catch { return false; }
  }
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}
export const journalCategories: JournalCategory[] = ["exhibition", "event", "studio-update", "story"];
export function journalCategoryFor(entry: JournalEntry): JournalCategory {
  return entry.type;
}
export function getJournalEntriesForCategory(items: JournalEntry[], category?: JournalCategory) {
  return category ? items.filter((entry) => journalCategoryFor(entry) === category) : items;
}
export type ArtistProfile = {
  statement: Localized;
  biography: Localized;
  portrait?: { src: string; alt: Localized; width: number; height: number; rightsConfirmed: boolean };
  status: Status;
  approvedLocales: Locale[];
  artistApproved: boolean;
};
export type ContactDetails = {
  email?: string;
  telegramHandle?: string;
  instagramUrl?: string;
  approvedLocales: Locale[];
  ownerApproved: boolean;
};
export type CvEntry = { id: string; category: "education" | "solo-exhibition" | "group-exhibition" | "award" | "publication" | "collection" | "other"; title: Localized; organization?: Localized; location?: Localized; year: number; verified: boolean; status: Status; sortOrder?: number };
export type CvDocument = { src: string; fileName: string; artistApproved: boolean; status: Status };
export type HomepageSelection = { heroArtworkId?: string; featuredArtworkIds: string[]; featuredGalleryIds: string[] };

// JSON-LD contains only owner-supplied identity facts that are also visible on the homepage.
export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://nasoodi.art/#artist",
      name: "Ghazaleh Abdolahzade Nasoodi",
      alternateName: "غزاله عبداله زاده نسودی",
      jobTitle: "Oil painter",
      url: "https://nasoodi.art/",
    },
    {
      "@type": "WebSite",
      "@id": "https://nasoodi.art/#website",
      name: "Nasoodi.art",
      url: "https://nasoodi.art/",
      inLanguage: ["fa", "en"],
      publisher: { "@id": "https://nasoodi.art/#artist" },
    },
  ],
} as const;

// The five source photographs were explicitly approved by the site owner for public portfolio use.
// Public derivatives are copied from specification/assets/gallery by scripts/copy-approved-gallery-assets.mjs.
// Intrinsic dimensions are generated from each source JPEG before dev/build, preserving its exact aspect ratio.
const approvedArtworkImages = [
  { src: "/images/approved-artwork-1.jpg", alt: { en: "Painting titled A Quiet Place Between Seasons", fa: "تابلوی نقاشی با عنوان «آرامش میان فصل‌ها»" }, role: "primary" as const, width: approvedArtworkImageDimensions[0].width, height: approvedArtworkImageDimensions[0].height },
  { src: "/images/approved-artwork-2.jpg", alt: { en: "Painting titled The Shape of Remembering", fa: "تابلوی نقاشی با عنوان «شکلِ خاطره»" }, role: "primary" as const, width: approvedArtworkImageDimensions[1].width, height: approvedArtworkImageDimensions[1].height },
  { src: "/images/approved-artwork-3.jpg", alt: { en: "Painting titled Where Light Rests", fa: "تابلوی نقاشی با عنوان «جایی که نور می‌آرامد»" }, role: "primary" as const, width: approvedArtworkImageDimensions[2].width, height: approvedArtworkImageDimensions[2].height },
  { src: "/images/approved-artwork-4.jpg", alt: { en: "Painting titled A Garden of Small Moments", fa: "تابلوی نقاشی با عنوان «باغ لحظه‌های کوچک»" }, role: "primary" as const, width: approvedArtworkImageDimensions[3].width, height: approvedArtworkImageDimensions[3].height },
  { src: "/images/approved-artwork-5.jpg", alt: { en: "Painting titled The Blue Hour Within", fa: "تابلوی نقاشی با عنوان «ساعت آبی درون»" }, role: "primary" as const, width: approvedArtworkImageDimensions[4].width, height: approvedArtworkImageDimensions[4].height },
];

export const artworks: Artwork[] = [
  { id: "artwork-quiet-place", slug: "a-quiet-place-between-seasons", title: { en: "A Quiet Place Between Seasons", fa: "آرامش میان فصل‌ها" }, description: { en: "A visual pause shaped around stillness and the quiet rhythm of looking. Its open-ended title leaves room for a personal reading.", fa: "مکثی تصویری در فضایی از سکون و تماشای آرام؛ عنوانی گشوده که به هر بیننده فرصت می‌دهد برداشت شخصی خود را از اثر داشته باشد." }, images: [approvedArtworkImages[0]], rightsConfirmed: true, status: "published", sortOrder: 1 },
  { id: "artwork-shape-of-remembering", slug: "the-shape-of-remembering", title: { en: "The Shape of Remembering", fa: "شکلِ خاطره" }, description: { en: "A reflection on the way memory gathers fragments into something felt rather than fully explained.", fa: "تأملی درباره‌ی شیوه‌ای که خاطره، تکه‌های پراکنده را کنار هم می‌نشاند و حسی فراتر از توضیح به وجود می‌آورد." }, images: [approvedArtworkImages[1]], rightsConfirmed: true, status: "published", sortOrder: 2 },
  { id: "artwork-where-light-rests", slug: "where-light-rests", title: { en: "Where Light Rests", fa: "جایی که نور می‌آرامد" }, description: { en: "An invitation to slow down and notice the delicate relationship between light, atmosphere, and attention.", fa: "دعوتی به آهسته‌تر دیدن و توجه به رابطه‌ی ظریف میان نور، فضا و نگاه." }, images: [approvedArtworkImages[2]], rightsConfirmed: true, status: "published", sortOrder: 3 },
  { id: "artwork-garden-small-moments", slug: "a-garden-of-small-moments", title: { en: "A Garden of Small Moments", fa: "باغ لحظه‌های کوچک" }, description: { en: "A gentle meditation on the small moments that accumulate into a larger sense of presence.", fa: "نگاهی آرام به لحظه‌های کوچکی که در کنار هم، معنای گسترده‌تری از حضور و زندگی می‌سازند." }, images: [approvedArtworkImages[3]], rightsConfirmed: true, status: "published", sortOrder: 4 },
  { id: "artwork-blue-hour-within", slug: "the-blue-hour-within", title: { en: "The Blue Hour Within", fa: "ساعت آبی درون" }, description: { en: "A contemplative title for a work that invites an inward journey and an unhurried encounter.", fa: "عنوانی تأمل‌برانگیز برای اثری که مخاطب را به سفری درونی و مواجهه‌ای بی‌شتاب دعوت می‌کند." }, images: [approvedArtworkImages[4]], rightsConfirmed: true, status: "published", sortOrder: 5 },
];

export const galleries: Gallery[] = [
  { id: "gallery-quiet-intervals", slug: "quiet-intervals", title: { en: "Quiet Intervals", fa: "فاصله‌های آرام" }, description: { en: "A considered sequence of works for an unhurried encounter with stillness, reflection, and the spaces between moments.", fa: "چیدمانی برای مواجهه‌ای بی‌شتاب با سکون، تأمل و فاصله‌هایی که میان لحظه‌ها شکل می‌گیرند." }, coverArtworkId: "artwork-quiet-place", artworkIds: ["artwork-quiet-place", "artwork-where-light-rests", "artwork-garden-small-moments"], status: "published", sortOrder: 1 },
  { id: "gallery-color-conversation", slug: "color-in-conversation", title: { en: "Color in Conversation", fa: "گفت‌وگوی رنگ‌ها" }, description: { en: "A visual route through selected works, inviting attention to the mood and relationships that emerge when paintings are viewed together.", fa: "مسیر دیداری‌ای میان چند اثر منتخب که با کنار هم دیدن آن‌ها می‌توان به حال‌وهوا و رابطه‌های تازه میان نقاشی‌ها توجه کرد." }, coverArtworkId: "artwork-where-light-rests", artworkIds: ["artwork-where-light-rests", "artwork-shape-of-remembering", "artwork-blue-hour-within"], status: "published", sortOrder: 2 },
  { id: "gallery-fragments-memory", slug: "fragments-of-memory", title: { en: "Fragments of Memory", fa: "پاره‌های خاطره" }, description: { en: "A small collection arranged around recollection, personal association, and the poetry of details.", fa: "مجموعه‌ای کوچک با محوریت یادآوری، تداعی‌های شخصی و شاعرانگی جزئیات." }, coverArtworkId: "artwork-shape-of-remembering", artworkIds: ["artwork-shape-of-remembering", "artwork-garden-small-moments", "artwork-blue-hour-within"], status: "published", sortOrder: 3 },
  { id: "gallery-selected-works", slug: "selected-works", title: { en: "Selected Works", fa: "گزیده آثار" }, description: { en: "Five paintings brought together as an introduction to this selection of the artist’s work.", fa: "پنج نقاشی در کنار هم؛ آشنایی‌ای کوتاه با این گزیده از آثار هنرمند." }, coverArtworkId: "artwork-quiet-place", artworkIds: ["artwork-quiet-place", "artwork-shape-of-remembering", "artwork-where-light-rests", "artwork-garden-small-moments", "artwork-blue-hour-within"], status: "published", sortOrder: 4 },
];
// Owner-authorized temporary Journal imagery: existing approved gallery paintings are used as clearly labelled placeholders,
// not represented as event documentation. Replace these mappings with real Journal/event photographs during content review.
const journalPlaceholderImages = [
  { image: approvedArtworkImages[0], alt: { en: "Temporary Journal image placeholder: A Quiet Place Between Seasons", fa: "تصویر موقت یادداشت: آرامش میان فصل‌ها" } },
  { image: approvedArtworkImages[1], alt: { en: "Temporary Journal image placeholder: The Shape of Remembering", fa: "تصویر موقت یادداشت: شکل خاطره" } },
  { image: approvedArtworkImages[2], alt: { en: "Temporary Journal image placeholder: Where Light Rests", fa: "تصویر موقت یادداشت: جایی که نور می‌آرامد" } },
  { image: approvedArtworkImages[3], alt: { en: "Temporary Journal image placeholder: A Garden of Small Moments", fa: "تصویر موقت یادداشت: باغ لحظه‌های کوچک" } },
  { image: approvedArtworkImages[4], alt: { en: "Temporary Journal image placeholder: The Blue Hour Within", fa: "تصویر موقت یادداشت: ساعت آبی درون" } },
] as const;
function journalPlaceholderCover(index: number): NonNullable<JournalEntry["coverImage"]> {
  const { image, alt } = journalPlaceholderImages[index % journalPlaceholderImages.length];
  return { src: image.src, alt, width: image.width, height: image.height, rightsConfirmed: true };
}

export const journalEntries: JournalEntry[] = [
  {
    id: "journal-studio-notes-november-2026",
    coverImage: journalPlaceholderCover(0),
    slug: "between-layers-studio-notes",
    type: "studio-update",
    title: { en: "Between Layers: Notes from the Studio", fa: "میان لایه‌ها: یادداشت‌هایی از آتلیه" },
    summary: { en: "A few reflections on slow looking, translucent colour, and the small decisions that shape a painting while it is still becoming.", fa: "تأملی کوتاه درباره تماشای آهسته، رنگ‌های شفاف و تصمیم‌های کوچکی که در مسیر شکل‌گرفتن یک نقاشی معنا پیدا می‌کنند." },
    body: {
      en: [
        { type: "paragraph", text: "The studio has been full of unfinished conversations between colour and surface. Some passages are built slowly, with thin layers that allow earlier marks to remain present; others ask for a more decisive gesture." },
        { type: "heading", level: 2, text: "Leaving room for the painting" },
        { type: "paragraph", text: "Working in layers is also a way of listening. A shape may become quieter after another colour is placed beside it, while a small change in light can bring an overlooked detail forward. The process is less about reaching a fixed image quickly and more about recognising when the work has found its own balance." },
        { type: "quote", text: "Sometimes the most important decision is to leave a little space untouched." },
        { type: "paragraph", text: "A new group of paintings is taking shape around these ideas. The next studio notes will follow how the works develop from their first marks into more settled compositions." }
      ],
      fa: [
        { type: "paragraph", text: "این روزها آتلیه پر از گفت‌وگوهای ناتمام میان رنگ و سطح است. بعضی بخش‌ها با لایه‌های نازک و آرام شکل می‌گیرند تا ردّ رنگ‌های پیشین باقی بماند؛ بخش‌های دیگر به حرکتی قاطع‌تر نیاز دارند." },
        { type: "heading", level: 2, text: "جا گذاشتن برای خود نقاشی" },
        { type: "paragraph", text: "کارکردن در لایه‌ها، نوعی گوش‌دادن نیز هست. گاهی شکلی با قرارگرفتن رنگی دیگر در کنارش آرام‌تر می‌شود و گاهی تغییری کوچک در نور، جزئیاتی را آشکار می‌کند که پیش‌تر دیده نشده بود. هدف، رسیدن شتاب‌زده به تصویری ثابت نیست؛ مهم‌تر آن است که لحظه تعادل اثر را تشخیص دهیم." },
        { type: "quote", text: "گاهی مهم‌ترین تصمیم، دست‌نخورده گذاشتن بخشی از بوم است." },
        { type: "paragraph", text: "گروهی تازه از نقاشی‌ها پیرامون همین ایده‌ها در حال شکل‌گیری است. یادداشت بعدی، مسیر تبدیل نخستین نشانه‌ها به ترکیب‌بندی‌هایی آرام‌تر را دنبال خواهد کرد." }
      ]
    },
    status: "published", publishedAt: "2026-11-01T08:30:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true
  },
  {
    id: "journal-exhibition-open-studio-2026",
    coverImage: journalPlaceholderCover(1),
    slug: "open-studio-colour-and-stillness",
    type: "exhibition",
    title: { en: "Open Studio: Colour and Stillness", fa: "آتلیه باز: رنگ و سکون" },
    summary: { en: "An intimate afternoon among recent paintings, with time to look closely at the surfaces, colour relationships, and quiet details of each work.", fa: "بعدازظهری صمیمی در کنار نقاشی‌های تازه؛ فرصتی برای تماشای نزدیک سطح آثار، نسبت رنگ‌ها و جزئیات آرام هر تابلو." },
    body: {
      en: [
        { type: "paragraph", text: "The studio doors will open for a small gathering centred on recent paintings and the decisions behind them. Visitors are welcome to move through the works at their own pace and spend time with the details that often disappear in a quick glance." },
        { type: "heading", level: 2, text: "A closer look" },
        { type: "paragraph", text: "The afternoon brings together paintings at different stages of completion. Seeing them side by side offers a chance to notice how a recurring colour, a softened edge, or an open area of canvas can change the feeling of an entire composition." },
        { type: "paragraph", text: "The gathering is informal and designed for conversation. No prior knowledge of painting is needed; curiosity and time to look are enough." }
      ],
      fa: [
        { type: "paragraph", text: "درهای آتلیه برای دیداری کوچک با محوریت نقاشی‌های تازه و تصمیم‌هایی که پشت شکل‌گیری آن‌ها قرار دارد گشوده می‌شود. بازدیدکنندگان می‌توانند با ریتم خود میان آثار حرکت کنند و برای جزئیاتی وقت بگذارند که در نگاه سریع پنهان می‌مانند." },
        { type: "heading", level: 2, text: "تماشایی نزدیک‌تر" },
        { type: "paragraph", text: "این بعدازظهر نقاشی‌هایی را کنار هم قرار می‌دهد که در مرحله‌های متفاوتی از تکمیل هستند. دیدن آن‌ها در کنار یکدیگر فرصتی است برای توجه به اینکه یک رنگ تکرارشونده، لبه‌ای نرم‌شده یا فضای خالی بوم چگونه می‌تواند حس کلی ترکیب‌بندی را تغییر دهد." },
        { type: "paragraph", text: "این گردهمایی فضایی غیررسمی و گفت‌وگومحور دارد. آشنایی قبلی با نقاشی ضروری نیست؛ کنجکاوی و فرصت تماشا کافی است." }
      ]
    },
    status: "published", publishedAt: "2026-10-29T10:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true,
    event: { startsAt: "2026-11-14T14:00:00+00:00", endsAt: "2026-11-14T17:00:00+00:00", timeZone: "Europe/London", venue: { en: "The Studio, London", fa: "آتلیه، لندن" }, attendanceMode: "in-person" }
  },
  {
    id: "journal-story-colour-memory",
    coverImage: journalPlaceholderCover(2),
    slug: "the-colours-that-memory-keeps",
    type: "story",
    title: { en: "The Colours That Memory Keeps", fa: "رنگ‌هایی که در خاطره می‌مانند" },
    summary: { en: "On the way familiar colours return as atmosphere rather than exact images, and how memory can become a starting point for painting.", fa: "درباره بازگشت رنگ‌های آشنا نه به شکل تصویری دقیق، بلکه همچون حال‌وهوا؛ و اینکه خاطره چگونه می‌تواند نقطه آغاز یک نقاشی باشد." },
    body: {
      en: [
        { type: "paragraph", text: "Memory rarely arrives as a complete picture. It is more likely to return as a particular warmth, a muted blue, or the feeling of light at the end of a day. These fragments can be more suggestive than a detailed recollection." },
        { type: "heading", level: 2, text: "A palette of impressions" },
        { type: "paragraph", text: "In the studio, a remembered colour is not copied so much as translated. It changes beside other colours, gathers new associations, and gradually becomes part of a present-tense image." },
        { type: "paragraph", text: "Painting offers a way to stay with these impressions without needing to explain them completely. The viewer can bring their own memories to the work and let the colours open a different conversation." }
      ],
      fa: [
        { type: "paragraph", text: "خاطره به‌ندرت به شکل تصویری کامل بازمی‌گردد. بیشتر اوقات، گرمایی خاص، آبیِ محو یا حس نور در پایان روز را با خود می‌آورد. این تکه‌های پراکنده گاهی از یادآوری دقیق و جزئی الهام‌بخش‌ترند." },
        { type: "heading", level: 2, text: "پالتِ دریافت‌ها" },
        { type: "paragraph", text: "در آتلیه، رنگی که از خاطره می‌آید بیشتر ترجمه می‌شود تا بازسازی. در کنار رنگ‌های دیگر تغییر می‌کند، تداعی‌های تازه‌ای پیدا می‌کند و آرام‌آرام به بخشی از تصویری در زمان حال تبدیل می‌شود." },
        { type: "paragraph", text: "نقاشی راهی برای ماندن در کنار این دریافت‌هاست، بی‌آنکه لازم باشد همه‌چیز به‌طور کامل توضیح داده شود. بیننده نیز خاطرات خود را به اثر می‌آورد و گفت‌وگویی تازه با رنگ‌ها آغاز می‌کند." }
      ]
    },
    status: "published", publishedAt: "2026-10-24T09:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true
  },
  {
    id: "journal-studio-light-study",
    coverImage: journalPlaceholderCover(3),
    slug: "studying-the-changing-light",
    type: "studio-update",
    title: { en: "Studying the Changing Light", fa: "مطالعه نورِ در حال تغییر" },
    summary: { en: "A studio note on observing how daylight shifts across a painted surface and changes the relationship between neighbouring tones.", fa: "یادداشتی از آتلیه درباره مشاهده جابه‌جایی نور روز بر سطح نقاشی و تغییر رابطه میان تُن‌های رنگی در کنار یکدیگر." },
    body: {
      en: [
        { type: "paragraph", text: "Light in the studio is never quite the same from one hour to the next. A colour that feels settled in the morning may become unexpectedly vivid later in the day." },
        { type: "paragraph", text: "Returning to a painting under different conditions is a useful reminder that looking is an active part of making. It can reveal where a transition needs patience and where a stronger contrast gives the composition its rhythm." },
        { type: "paragraph", text: "These observations continue to inform the current group of works, especially the quieter passages where small tonal differences carry much of the atmosphere." }
      ],
      fa: [
        { type: "paragraph", text: "نور آتلیه از ساعتی به ساعت دیگر یکسان نمی‌ماند. رنگی که صبح آرام و متعادل به نظر می‌رسد، ممکن است در ادامه روز ناگهان زنده‌تر و پررنگ‌تر شود." },
        { type: "paragraph", text: "بازگشتن به یک نقاشی در شرایط نوری متفاوت یادآوری می‌کند که تماشا بخشی فعال از آفرینش اثر است. گاهی آشکار می‌کند کدام گذار به صبر بیشتری نیاز دارد و کجا تضادی قوی‌تر به ترکیب‌بندی ریتم می‌بخشد." },
        { type: "paragraph", text: "این مشاهده‌ها همچنان بر مجموعه تازه آثار اثر می‌گذارند؛ به‌ویژه در بخش‌های آرام‌تری که تفاوت‌های کوچک تُن رنگی، بخش بزرگی از حال‌وهوا را می‌سازند." }
      ]
    },
    status: "published", publishedAt: "2026-10-18T11:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true
  },
  {
    id: "journal-online-conversation-art",
    coverImage: journalPlaceholderCover(4),
    slug: "a-conversation-about-looking",
    type: "event",
    title: { en: "A Conversation About Looking", fa: "گفت‌وگویی درباره تماشا" },
    summary: { en: "An online conversation about attention, the experience of looking at paintings, and the small details that shape a personal response.", fa: "گفت‌وگویی آنلاین درباره توجه، تجربه تماشای نقاشی و جزئیات کوچکی که برداشت شخصی ما را شکل می‌دهند." },
    body: {
      en: [
        { type: "paragraph", text: "This online gathering explores the experience of spending time with a painting. Rather than offering a single interpretation, the conversation will consider how attention, memory, and personal association influence what each viewer notices." },
        { type: "heading", level: 2, text: "Joining the conversation" },
        { type: "paragraph", text: "The session is planned as an open exchange with a short introduction followed by questions and reflections from participants. A viewing link and joining details will be shared with registered guests." }
      ],
      fa: [
        { type: "paragraph", text: "این دیدار آنلاین به تجربه وقت‌گذراندن در کنار یک نقاشی می‌پردازد. به‌جای ارائه یک تفسیر قطعی، گفت‌وگو بررسی می‌کند که توجه، خاطره و تداعی‌های شخصی چگونه بر آنچه هر بیننده می‌بیند اثر می‌گذارند." },
        { type: "heading", level: 2, text: "پیوستن به گفت‌وگو" },
        { type: "paragraph", text: "این نشست با مقدمه‌ای کوتاه آغاز می‌شود و سپس به پرسش‌ها و دریافت‌های شرکت‌کنندگان می‌رسد. پیوند حضور و جزئیات ورود برای مهمانان ثبت‌نام‌شده ارسال خواهد شد." }
      ]
    },
    status: "published", publishedAt: "2026-10-15T08:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true,
    event: { startsAt: "2026-12-05T16:00:00+00:00", endsAt: "2026-12-05T17:00:00+00:00", timeZone: "Europe/London", attendanceMode: "online" }
  },
  {
    id: "journal-story-space-between",
    coverImage: journalPlaceholderCover(5),
    slug: "the-space-between-marks",
    type: "story",
    title: { en: "The Space Between Marks", fa: "فضای میان نشانه‌ها" },
    summary: { en: "A reflection on pauses, edges, and the open spaces that allow a painting to breathe.", fa: "تأملی درباره مکث‌ها، لبه‌ها و فضاهای بازی که به یک نقاشی امکان نفس‌کشیدن می‌دهند." },
    body: {
      en: [
        { type: "paragraph", text: "A painting is shaped by what is placed on the surface and by what is allowed to remain open. The intervals between marks can hold a surprising amount of energy." },
        { type: "paragraph", text: "Sometimes a pause gives the eye a place to rest. Sometimes it makes a nearby gesture feel more immediate. These spaces are not empty in the ordinary sense; they are part of the composition's quiet structure." }
      ],
      fa: [
        { type: "paragraph", text: "یک نقاشی هم با آنچه بر سطح قرار می‌گیرد شکل می‌گیرد و هم با آنچه باز و دست‌نخورده باقی می‌ماند. فاصله میان نشانه‌ها می‌تواند انرژی شگفت‌آوری در خود نگه دارد." },
        { type: "paragraph", text: "گاهی مکث، جایی برای آسودن نگاه فراهم می‌کند و گاهی حرکتی نزدیک را ملموس‌تر می‌سازد. این فضاها به معنای معمول خالی نیستند؛ آن‌ها بخشی از ساختار آرام ترکیب‌بندی‌اند." }
      ]
    },
    status: "published", publishedAt: "2026-10-10T09:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true
  },
  {
    id: "journal-exhibition-notes-2026",
    coverImage: journalPlaceholderCover(6),
    slug: "notes-on-colour-and-presence",
    type: "exhibition",
    title: { en: "Notes on Colour and Presence", fa: "یادداشت‌هایی درباره رنگ و حضور" },
    summary: { en: "A look back at a small presentation of paintings exploring colour, atmosphere, and the presence of everyday moments.", fa: "نگاهی به ارائه‌ای کوچک از نقاشی‌ها با محوریت رنگ، فضا و حضور لحظه‌های روزمره." },
    body: {
      en: [
        { type: "paragraph", text: "This presentation brought together a selection of paintings connected by an interest in atmosphere and the feeling of ordinary moments. Viewed as a group, the works revealed recurring colours and subtle shifts in scale and rhythm." },
        { type: "heading", level: 2, text: "Looking back" },
        { type: "paragraph", text: "The conversations around the paintings returned often to the experience of slowing down. Visitors noticed details at different distances, and each change in viewpoint offered another way into the work." },
        { type: "paragraph", text: "The selection remains an important point of reference for the ongoing studio practice and for the questions that continue to shape new paintings." }
      ],
      fa: [
        { type: "paragraph", text: "این ارائه، گزیده‌ای از نقاشی‌ها را کنار هم قرار داد که با علاقه به فضا و حس لحظه‌های روزمره به یکدیگر پیوند می‌خوردند. آثار در کنار هم، رنگ‌های تکرارشونده و تغییرهای ظریف در مقیاس و ریتم را آشکار می‌کردند." },
        { type: "heading", level: 2, text: "نگاهی به گذشته" },
        { type: "paragraph", text: "گفت‌وگوهای پیرامون نقاشی‌ها بارها به تجربه آهسته‌شدن بازمی‌گشت. بازدیدکنندگان از فاصله‌های گوناگون به جزئیات توجه می‌کردند و هر تغییر زاویه، راهی تازه برای ورود به اثر می‌گشود." },
        { type: "paragraph", text: "این گزیده همچنان نقطه ارجاعی برای فعالیت جاری آتلیه و پرسش‌هایی است که به شکل‌گیری نقاشی‌های تازه کمک می‌کنند." }
      ]
    },
    status: "published", publishedAt: "2026-10-03T09:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true,
    event: { startsAt: "2026-09-12T11:00:00+01:00", endsAt: "2026-09-19T17:00:00+01:00", timeZone: "Europe/London", venue: { en: "Project Space, London", fa: "فضای پروژه، لندن" }, attendanceMode: "in-person" }
  },
  {
    id: "journal-studio-colour-study",
    coverImage: journalPlaceholderCover(7),
    slug: "a-study-in-muted-colours",
    type: "studio-update",
    title: { en: "A Study in Muted Colours", fa: "مطالعه‌ای با رنگ‌های خاموش" },
    summary: { en: "A brief note on balancing warm neutrals with a restrained range of blue and green.", fa: "یادداشتی کوتاه درباره ایجاد تعادل میان رنگ‌های خنثی گرم و طیفی محدود از آبی و سبز." },
    body: {
      en: [
        { type: "paragraph", text: "A limited palette can make small differences feel more important. Warm neutrals create a steady ground, while a measured note of blue or green can shift the mood without disturbing the overall balance." },
        { type: "paragraph", text: "The study began as a way to test these relationships before they find their place in larger compositions. It remains open, with several possibilities still being considered." }
      ],
      fa: [
        { type: "paragraph", text: "پالت محدود می‌تواند تفاوت‌های کوچک را برجسته‌تر کند. رنگ‌های خنثی و گرم زمینه‌ای پایدار می‌سازند و اشاره‌ای سنجیده به آبی یا سبز می‌تواند حال‌وهوا را بدون برهم‌زدن تعادل کلی تغییر دهد." },
        { type: "paragraph", text: "این مطالعه برای آزمودن همین رابطه‌ها پیش از ورودشان به ترکیب‌بندی‌های بزرگ‌تر آغاز شد. هنوز باز است و چند امکان متفاوت در حال بررسی‌اند." }
      ]
    },
    status: "published", publishedAt: "2026-09-25T10:00:00+00:00", approvedLocales: ["en", "fa"], artistApproved: true
  }
];
export const cvEntries: CvEntry[] = [];
// No artist-approved public CV PDF has been supplied yet.
export const cvDocument: CvDocument | undefined = undefined;
export const artistProfile: ArtistProfile | undefined = undefined;
export const contactDetails: ContactDetails = {
  email: "studio@example.com",
  telegramHandle: "nasoodi_contact_demo",
  instagramUrl: "https://www.instagram.com/ghazaleh.nasoodi.demo/",
  approvedLocales: ["en", "fa"],
  ownerApproved: true,
};
export const homepageSelection: HomepageSelection = { featuredArtworkIds: ["artwork-quiet-place", "artwork-shape-of-remembering", "artwork-where-light-rests", "artwork-garden-small-moments", "artwork-blue-hour-within"], featuredGalleryIds: ["gallery-quiet-intervals", "gallery-color-conversation", "gallery-fragments-memory", "gallery-selected-works"] };
export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? "null").replace(/</g, "\\u003c");
}
export function getArtworkStructuredData(work: Artwork, locale: Locale) {
  const image = primaryImageFor(work);
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.title[locale],
    creator: { "@id": "https://nasoodi.art/#artist" },
    ...(image ? { image: new URL(image.src, "https://nasoodi.art").toString() } : {}),
    ...(Number.isInteger(work.year) && work.year! > 0 ? { dateCreated: String(work.year) } : {}),
    ...(work.medium?.[locale]?.trim() ? { artMedium: work.medium[locale] } : {}),
    ...(work.description?.[locale]?.trim() ? { description: work.description[locale] } : {}),
  };
}
export function getGalleryStructuredData(gallery: Gallery, works: Artwork[], locale: Locale, canonicalUrl: string): Record<string, unknown> {
  const publishedWorks = getPublicArtworks(works, locale);
  const members = gallery.artworkIds
    .map((id) => publishedWorks.find((work) => work.id === id))
    .filter((work): work is Artwork => work !== undefined);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: gallery.title[locale],
    description: gallery.description[locale],
    url: canonicalUrl,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: members.length,
      itemListElement: members.map((work, index) => {
        const image = primaryImageFor(work);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VisualArtwork",
            name: work.title[locale],
            url: `https://nasoodi.art${pagePath(locale, `works/${work.slug}`)}`,
            ...(image ? { image: new URL(image.src, "https://nasoodi.art").toString() } : {}),
          },
        };
      }),
    },
  };
}
export function getJournalStructuredData(entry: JournalEntry, locale: Locale, canonicalUrl: string): Record<string, unknown> {
  const common = {
    "@context": "https://schema.org",
    name: entry.title[locale],
    description: entry.summary[locale],
    url: canonicalUrl,
    inLanguage: locale,
  };
  if (entry.event) {
    const attendanceModes = {
      "in-person": "https://schema.org/OfflineEventAttendanceMode",
      online: "https://schema.org/OnlineEventAttendanceMode",
      hybrid: "https://schema.org/MixedEventAttendanceMode",
    } as const;
    return {
      ...common,
      "@type": "Event",
      startDate: entry.event.startsAt,
      ...(entry.event.endsAt ? { endDate: entry.event.endsAt } : {}),
      ...(entry.event.attendanceMode
        ? { eventAttendanceMode: attendanceModes[entry.event.attendanceMode] }
        : {}),
      ...(entry.event.venue?.[locale]
        ? { location: { "@type": "Place", name: entry.event.venue[locale] } }
        : {}),
    };
  }
  return {
    ...common,
    "@type": "Article",
    headline: entry.title[locale],
    author: { "@id": "https://nasoodi.art/#artist" },
    ...(entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt))
      ? { datePublished: entry.publishedAt }
      : {}),
  };
}
export function isSafeLocalImagePath(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("\\") ||
    /[?#\u0000-\u001f]/.test(src) || /%(?:2e|2f|5c)/i.test(src)) return false;
  return src.split("/").every((segment) => segment !== "." && segment !== "..");
}
export function primaryImageFor(work: Artwork) {
  return work.images.find((image) => image.role === "primary" && isSafeLocalImagePath(image.src) &&
    image.width > 0 && image.height > 0);
}
function keepUniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return items.filter((item) => {
    const key = keyOf(item);
    return Boolean(key.trim()) && counts.get(key) === 1;
  });
}
export function isSafeContentSlug(slug: string): boolean {
  return /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug);
}
export function getPublicArtworks(items: Artwork[], locale: Locale) {
  const visible = items.filter((work) => work.status === "published" && work.rightsConfirmed &&
    Boolean(work.id.trim()) && isSafeContentSlug(work.slug) &&
    Boolean(work.title[locale]?.trim()) && Boolean(primaryImageFor(work)?.alt[locale]?.trim()));
  return keepUniqueBy(keepUniqueBy(visible, (work) => work.id), (work) => work.slug)
    .sort((a,b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export function getPublicGalleries(items: Gallery[], works: Artwork[], locale: Locale) {
  const ids = new Set(getPublicArtworks(works, locale).map((work) => work.id));
  const visible = items.filter((g) => g.status === "published" && Boolean(g.id.trim()) &&
    isSafeContentSlug(g.slug) && Boolean(g.title[locale]?.trim()) &&
    Boolean(g.description[locale]?.trim()) && g.artworkIds.length > 0 &&
    new Set(g.artworkIds).size === g.artworkIds.length && g.artworkIds.includes(g.coverArtworkId) &&
    g.artworkIds.every((id) => ids.has(id)));
  return keepUniqueBy(keepUniqueBy(visible, (gallery) => gallery.id), (gallery) => gallery.slug)
    .sort((a,b) => a.sortOrder-b.sortOrder);
}
export function getGalleryCoverArtwork(gallery: Gallery, works: Artwork[], locale: Locale) {
  const cover = getPublicArtworks(works, locale).find((work) => work.id === gallery.coverArtworkId);
  return cover ? primaryImageFor(cover) ? { artwork: cover, image: primaryImageFor(cover)! } : undefined : undefined;
}
export function hasExplicitTimeZone(value: string): boolean {
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) && Number.isFinite(Date.parse(value));
}
export function getPublicJournal(items: JournalEntry[], locale: Locale) {
  const visible = items.filter((entry) => {
    if (entry.status !== "published" || !entry.artistApproved || !entry.approvedLocales.includes(locale) ||
      !entry.id.trim() || !isSafeContentSlug(entry.slug) || !entry.title[locale]?.trim() || !entry.summary[locale]?.trim()) return false;
    if (entry.type === "event" && !entry.event) return false;
    if (!entry.event) return true;
    const event = entry.event;
    if (!hasExplicitTimeZone(event.startsAt) || !event.timeZone ||
      (!event.venue?.[locale]?.trim() && !event.attendanceMode)) return false;
    try { new Intl.DateTimeFormat(locale, { timeZone: event.timeZone }); } catch { return false; }
    if (event.endsAt && (!hasExplicitTimeZone(event.endsAt) || Date.parse(event.endsAt) < Date.parse(event.startsAt))) return false;
    if (event.registrationUrl && !isSafeJournalHref(event.registrationUrl)) return false;
    return true;
  });
  return keepUniqueBy(keepUniqueBy(visible, (entry) => entry.id), (entry) => entry.slug)
    .sort((a, b) => {
      const timestamp = (entry: JournalEntry) => entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt)) ? Date.parse(entry.publishedAt) : Number.NEGATIVE_INFINITY;
      return timestamp(b) - timestamp(a) || (a.id < b.id ? -1 : a.id > b.id ? 1 : a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
    });
}
export function journalCoverImageFor(entry: JournalEntry, locale: Locale): NonNullable<JournalEntry["coverImage"]> | undefined {
  const image = entry.coverImage;
  if (!image || !image.rightsConfirmed || !isSafeLocalImagePath(image.src) || !Number.isSafeInteger(image.width) || image.width < 1 || !Number.isSafeInteger(image.height) || image.height < 1 || !image.alt[locale]?.trim()) return undefined;
  return image;
}
export function getHomepageJournalPreview(items: JournalEntry[], locale: Locale): JournalEntry[] {
  return getPublicJournal(items, locale).slice(0, 1);
}
export function getUpcomingJournalEvents(items: JournalEntry[], locale: Locale, now: Date = new Date()) {
  const nowMs = now.getTime();
  return getPublicJournal(items, locale)
    .filter((entry) => {
      if ((entry.type !== "event" && entry.type !== "exhibition") || !entry.event) return false;
      const startsAt = Date.parse(entry.event.startsAt);
      const endsAt = entry.event.endsAt ? Date.parse(entry.event.endsAt) : startsAt;
      return Number.isFinite(startsAt) && startsAt > nowMs && endsAt > nowMs;
    })
    .sort((a, b) => Date.parse(a.event!.startsAt) - Date.parse(b.event!.startsAt) ||
      a.id.localeCompare(b.id) || a.slug.localeCompare(b.slug));
}
export function getUpcomingJournalEvent(items: JournalEntry[], locale: Locale, now: Date = new Date()): JournalEntry | undefined {
  return getUpcomingJournalEvents(items, locale, now)[0];
}
export function getPublicCvEntries(items: CvEntry[], locale: Locale) {
  const visible = items.filter((entry) => entry.status === "published" && entry.verified &&
    Boolean(entry.id.trim()) && Boolean(entry.title[locale]?.trim()) &&
    Number.isInteger(entry.year) && entry.year > 0);
  return keepUniqueBy(visible, (entry) => entry.id)
    .sort((a,b) => b.year - a.year || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export function getPublicCvDocument(document: CvDocument | undefined) {
  if (!document || document.status !== "published" || !document.artistApproved ||
      !isSafeLocalImagePath(document.src) || !/\.pdf$/i.test(document.src) ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/i.test(document.fileName)) return undefined;
  return document;
}
export function getPublicArtistProfile(profile: ArtistProfile | undefined, locale: Locale) {
  if (!profile || profile.status !== "published" || !profile.artistApproved ||
      !profile.approvedLocales.includes(locale) || !profile.statement[locale]?.trim() ||
      !profile.biography[locale]?.trim()) return undefined;
  const portrait = profile.portrait;
  const validPortrait = portrait && portrait.rightsConfirmed && portrait.width > 0 && portrait.height > 0 &&
    isSafeLocalImagePath(portrait.src) && Boolean(portrait.alt[locale]?.trim());
  return { ...profile, portrait: validPortrait ? portrait : undefined };
}
export function getPublicContactDetails(details: ContactDetails | undefined, locale: Locale) {
  if (!details || !details.ownerApproved || !details.approvedLocales.includes(locale)) return undefined;
  const email = details.email?.trim() ?? "";
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
  const telegramHandle = details.telegramHandle && /^[A-Za-z0-9_]{5,32}$/.test(details.telegramHandle) ? details.telegramHandle : undefined;
  let instagramUrl: string | undefined;
  if (details.instagramUrl) {
    try {
      const url = new URL(details.instagramUrl);
      if (url.protocol === "https:" && (url.hostname === "instagram.com" || url.hostname === "www.instagram.com")) instagramUrl = url.toString();
    } catch { /* Invalid external destinations are omitted. */ }
  }
  return validEmail && telegramHandle && instagramUrl ? { email: validEmail, telegramHandle, telegramUrl: `https://t.me/${telegramHandle}`, instagramUrl } : undefined;
}

export function getHomepageHero(items: Artwork[], selection: HomepageSelection, locale: Locale) {
  if (!selection.heroArtworkId) return undefined;
  return getPublicArtworks(items, locale).find((work) => work.id === selection.heroArtworkId);
}
export function getHomepageFeaturedArtworks(items: Artwork[], selection: HomepageSelection, locale: Locale) {
  const available = new Map(getPublicArtworks(items, locale).map((work) => [work.id, work]));
  return [...new Set(selection.featuredArtworkIds)].map((id) => available.get(id)).filter((work) => work !== undefined);
}
export function getHomepageFeaturedGalleries(items: Gallery[], works: Artwork[], selection: HomepageSelection, locale: Locale) {
  const available = new Map(getPublicGalleries(items, works, locale).map((gallery) => [gallery.id, gallery]));
  return [...new Set(selection.featuredGalleryIds)].map((id) => available.get(id)).filter((gallery) => gallery !== undefined);
}
export const copy = {
 en: { home:"Home",works:"Works",galleries:"Galleries",journal:"Journal",about:"About",contact:"Contact",cv:"CV / Exhibitions",statement:"Artist statement",biography:"Biography",email:"Email",instagram:"Instagram",telegram:"Telegram",contactIntro:"For studio correspondence and enquiries, use one of the contact channels below.",language:"Language",menu:"Open navigation",close:"Close navigation",skip:"Skip to content",portfolio:"Artist portfolio",discipline:"Oil painter",selected:"Selected works",selectedIntro:"A considered selection of paintings.",explore:"Explore works",discover:"Discover the galleries",latest:"From the journal",upcoming:"Upcoming event",announcementEyebrow:"UPCOMING EXHIBITION",dismissAnnouncement:"Dismiss exhibition announcement",publicationDate:"Published",eventDate:"Event date",eventEnds:"Ends",eventVenue:"Venue",attendanceMode:"Attendance",inPerson:"In person",online:"Online",hybrid:"Hybrid",registration:"Details and registration",emptyWorks:"Selected paintings will appear here once their images and details are approved for publication.",emptyGalleries:"Curated galleries will appear here when their titles, selections, and cover works are approved.",emptyJournal:"Journal stories and event announcements will appear here when they are ready to publish.",profilePending:"The artist statement and biography will be added after editorial review.",contactPending:"Public contact details have not yet been confirmed.",notFound:"This page could not be found.",returnHome:"Return home",rights:"All rights reserved.",journalAll:"All",journalExhibitions:"Exhibitions",journalEvents:"Events",journalStudio:"Studio updates",journalStories:"Stories",journalNoMatches:"There are no published entries in this category yet.",readMore:"Read more",aboutArtist:"About the artist",showLess:"Show less",downloadCvPdf:"Download CV (PDF)",sampleContentNotice:"Sample content for design review — not artist-approved or publishable.",samplePreviewNotice:"Sample preview: all copy and CV entries are fictional layout fixtures and are not approved for publication.",samplePdfNotice:"This clearly marked fictional PDF is available for preview testing only; it is not a real artist CV.",published:"Published",itemsPerPage:"Items per page",previousPage:"Previous page",nextPage:"Next page",galleryPage:"Gallery page",showingGalleries:"Showing {start}–{end} of {total} galleries",showingJournal:"Showing {start}–{end} of {total} Journal entries",journalPage:"Journal pages" },
 fa: { home:"خانه",works:"آثار",galleries:"گالری‌ها",journal:"یادداشت‌ها",about:"درباره",contact:"تماس",cv:"رزومه و نمایشگاه‌ها",statement:"بیانیه هنری",biography:"زندگی‌نامه",email:"ایمیل",instagram:"اینستاگرام",telegram:"تلگرام",contactIntro:"برای مکاتبات و ارتباط با آتلیه می‌توانید از یکی از راه‌های زیر استفاده کنید.",language:"زبان",menu:"باز کردن راهبری",close:"بستن راهبری",skip:"رفتن به محتوای اصلی",portfolio:"پورتفولیوی هنرمند",discipline:"نقاش رنگ‌روغن",selected:"گزیده آثار",selectedIntro:"گزیده‌ای از نقاشی‌ها.",explore:"دیدن آثار",discover:"گشت‌وگذار در گالری‌ها",latest:"از یادداشت‌ها",upcoming:"رویداد پیشِ رو",announcementEyebrow:"نمایشگاه پیشِ رو",dismissAnnouncement:"بستن اطلاعیه نمایشگاه",publicationDate:"تاریخ انتشار",eventDate:"تاریخ رویداد",eventEnds:"پایان",eventVenue:"محل برگزاری",attendanceMode:"شیوه حضور",inPerson:"حضوری",online:"آنلاین",hybrid:"ترکیبی",registration:"اطلاعات رویداد",emptyWorks:"آثار پس از تأیید تصاویر و اطلاعات برای انتشار، در این بخش نمایش داده می‌شوند.",emptyGalleries:"گالری‌های منتخب پس از تأیید عنوان، آثار و تصویر اصلی در این بخش قرار می‌گیرند.",emptyJournal:"یادداشت‌ها و اطلاعیه‌های رویداد پس از آماده‌شدن برای انتشار در این بخش نمایش داده می‌شوند.",profilePending:"بیانیه هنری و زندگی‌نامه پس از بررسی و تأیید منتشر خواهند شد.",contactPending:"اطلاعات تماس عمومی هنوز تأیید نشده است.",notFound:"این صفحه پیدا نشد.",returnHome:"بازگشت به خانه",rights:"تمامی حقوق محفوظ است.",journalAll:"همه",journalExhibitions:"نمایشگاه‌ها",journalEvents:"رویدادها",journalStudio:"اخبار آتلیه",journalStories:"روایت‌ها",journalNoMatches:"هنوز مطلب منتشرشده‌ای در این دسته وجود ندارد.",readMore:"ادامه مطلب",aboutArtist:"درباره هنرمند",showLess:"نمایش کمتر",downloadCvPdf:"دریافت رزومه (PDF)",sampleContentNotice:"متن نمونه برای بررسی طراحی؛ تأییدنشده و غیرقابل انتشار",samplePreviewNotice:"پیش‌نمایش نمونه: تمام متن‌ها و سوابق این صفحه ساختگی‌اند و برای انتشار تأیید نشده‌اند.",samplePdfNotice:"این فایل PDF کاملاً ساختگی و فقط برای آزمایش پیش‌نمایش است؛ رزومه‌ی واقعی هنرمند نیست.",published:"انتشار",itemsPerPage:"تعداد در هر صفحه",previousPage:"صفحه قبل",nextPage:"صفحه بعد",galleryPage:"صفحه گالری‌ها",showingGalleries:"نمایش {start} تا {end} از {total} گالری",showingJournal:"نمایش {start} تا {end} از {total} مطلب",journalPage:"صفحه‌بندی یادداشت‌ها" }
} as const;
export const copyFor = (l: Locale) => copy[l];

/**
 * Resolve a locale switch to the equivalent published destination when it exists.
 * Static editorial routes have localized shells in both locales; content routes
 * fall back to the target locale home rather than connecting unrelated records.
 */
export function alternatePathFor(pathname: string, locale: Locale): string {
  const target = otherLocale(locale);
  const segments = pathname.split("/").filter(Boolean).slice(1);
  if (segments.length === 0) return pagePath(target);
  const [section, slug] = segments;
  if (section === "about" || section === "contact") return pagePath(target, section);
  if (section === "cv") {
    return getPublicCvEntries(cvEntries, target).length > 0 ? pagePath(target, "cv") : pagePath(target);
  }
  if (section === "works") {
    const items = getPublicArtworks(artworks, target);
    if (!slug) return items.length > 0 ? pagePath(target, "works") : pagePath(target);
    return items.some((item) => item.slug === slug) ? pagePath(target, `works/${slug}`) : pagePath(target);
  }
  if (section === "galleries") {
    const items = getPublicGalleries(galleries, artworks, target);
    if (!slug) return items.length > 0 ? pagePath(target, "galleries") : pagePath(target);
    return items.some((item) => item.slug === slug) ? pagePath(target, `galleries/${slug}`) : pagePath(target);
  }
  if (section === "journal") {
    const items = getPublicJournal(journalEntries, target);
    if (!slug) return items.length > 0 ? pagePath(target, "journal") : pagePath(target);
    return items.some((item) => item.slug === slug) ? pagePath(target, `journal/${slug}`) : pagePath(target);
  }
  return pagePath(target);
}
