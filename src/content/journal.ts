import { approvedArtworkImages } from "./artworks";
import type { JournalEntry } from "@/types/content";

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
