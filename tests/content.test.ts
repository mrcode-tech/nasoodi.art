import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { artworks } from "../src/content/artworks";
import { galleries } from "../src/content/galleries";
import { journalEntries } from "../src/content/journal";
import { homepageSelection } from "../src/content/homepage";
import { artistProfile } from "../src/content/artist";
import { cvDocument, cvEntries } from "../src/content/cv";
import { contactDetails } from "../src/content/contact";
import { siteContent } from "../src/content/site";
import { getEvents } from "../src/content/repositories/event.repository";
import { getHomepageContent } from "../src/content/repositories/homepage.repository";
import { getPortfolioStructuredData } from "../src/content/portfolio-structured-data";
import {
  getPublicArtworks,
  getPublicGalleries,
  getGalleryCoverArtwork,
  getPublicCvEntries,
  getPublicCvDocument,
  getPublicArtistProfile,
  getPublicContactDetails,
  getHomepageFeaturedArtworks,
} from "../src/lib/content/publication";
import {
  isSafeJournalHref,
  getPublicJournal,
  getUpcomingJournalEvents,
  getUpcomingJournalEvent,
  getJournalEntriesForCategory,
  getHomepageJournalPreview,
  journalCoverImageFor,
  hasExplicitTimeZone,
} from "../src/lib/content/journal";
import { getLocalizedSlug, isSafeLocalImagePath, isSafeContentSlug, matchesLocalizedSlug } from "../src/lib/content/paths";
import { hasEquivalentContentSet } from "../src/lib/content/identity";
import { alternatePathFor } from "../src/lib/routing/alternate-path";
import {
  getArtworkStructuredData,
  getGalleryStructuredData,
  getJournalStructuredData,
  serializeJsonLd,
} from "../src/lib/seo/structured-data";
import type { Artwork, Gallery, JournalEntry, CvEntry, CvDocument, ArtistProfile, ContactDetails } from "../src/types/content";
import { validatePortfolioContent } from "../src/lib/content/validate-portfolio";
import announcementConfig from "../src/content/announcement.json";
import { assertAnnouncementConfig, getAnnouncementHref } from "../src/lib/content/announcement-config";
const work:Artwork={id:"w1",slug:"work-one",localizedSlugs:{en:"work-one",fa:"اثر-اول"},title:{en:"Work",fa:"اثر"},description:{en:"Description",fa:"توضیح"},images:[{src:"/art/work.jpg",alt:{en:"Painting",fa:"نقاشی"},role:"primary",width:1200,height:900}],rightsConfirmed:true,status:"published"};
const validGallery:Gallery={id:"g1",slug:"gallery-one",localizedSlugs:{en:"gallery-one",fa:"گالری-اول"},title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:work.id,artworkIds:[work.id],status:"published",sortOrder:1};
const validJournalEntry:JournalEntry={id:"j1",slug:"story-one",localizedSlugs:{en:"story-one",fa:"روایت-اول"},type:"story",title:{en:"Story",fa:"روایت"},summary:{en:"Summary",fa:"خلاصه"},body:{en:[{type:"paragraph",text:"Body"}],fa:[{type:"paragraph",text:"متن"}]},status:"published",approvedLocales:["en","fa"],artistApproved:true};
const validArtistProfile:ArtistProfile={id:"profile-fixture",name:{en:"Artist",fa:"هنرمند"},slug:{en:"artist",fa:"هنرمند"},discipline:{en:"Painter",fa:"نقاش"},shortIntroduction:{en:"Introduction",fa:"معرفی"},artisticApproach:{en:"Approach",fa:"رویکرد"},interests:{en:["Painting"],fa:["نقاشی"]},statement:{en:"Statement",fa:"بیانیه"},biography:{en:"Biography",fa:"زندگی‌نامه"}};
const validSiteContent:typeof siteContent={id:"site-fixture",pages:{works:{title:{en:"Works",fa:"آثار"},description:{en:"Works",fa:"آثار"}},galleries:{title:{en:"Galleries",fa:"گالری‌ها"},description:{en:"Galleries",fa:"گالری‌ها"}},journal:{title:{en:"Journal",fa:"یادداشت‌ها"},description:{en:"Journal",fa:"یادداشت‌ها"}},cv:{title:{en:"CV",fa:"رزومه"},description:{en:"CV",fa:"رزومه"}}}};
const validContactDetails:ContactDetails={title:{en:"Contact",fa:"تماس"},description:{en:"Contact",fa:"تماس"},instagramUrl:"https://www.instagram.com/example/"};
const validPortfolioSource={artworks:[work],galleries:[validGallery],journalEntries:[validJournalEntry],cvEntries:[],homepageSelection:{featuredArtworkIds:[work.id],featuredGalleryIds:[validGallery.id]},artistProfile:validArtistProfile,contactDetails:validContactDetails,siteContent:validSiteContent};
test("artwork stays private until published and rights-cleared",()=>{assert.equal(getPublicArtworks([{...work,status:"needs-review"}],"en").length,0);assert.equal(getPublicArtworks([{...work,rightsConfirmed:false}],"en").length,0);assert.equal(getPublicArtworks([work],"en").length,1);});
test("artwork requires localized title and primary image alt",()=>{assert.equal(getPublicArtworks([{...work,title:{en:"Work"}}],"fa").length,0);assert.equal(getPublicArtworks([{...work,images:[{...work.images[0],alt:{en:""}}]}],"en").length,0);});

test("Persian content slugs accept combining marks and ZWNJ while rejecting unsafe separators",()=>{
  assert.equal(isSafeContentSlug("نمونه-پنجره"),true);
  assert.equal(isSafeContentSlug("آرامش-نمونه"),true);
 assert.equal(isSafeContentSlug("فاصله‌ی-میان"),true);
 assert.equal(isSafeContentSlug("safe--slug"),false);
 assert.equal(isSafeContentSlug("-unsafe"),false);
 assert.equal(isSafeContentSlug("unsafe-"),false);
 assert.equal(isSafeContentSlug("unsafe/segment"),false);
 assert.equal(isSafeContentSlug("unsafe?query"),false);
});

test("artwork publication exposes safe localized slugs from synthetic records",()=>{
 for(const locale of ["en","fa"] as const){
  const published=getPublicArtworks([work],locale);
  assert.equal(published.length,1);
  assert.ok(published.every(item=>isSafeContentSlug(getLocalizedSlug(item,locale))));
 }
});

test("artwork and gallery repositories sort synthetic records by year and editorial order",()=>{
 const older:Artwork={...work,id:"w-old",slug:"work-old",localizedSlugs:{en:"work-old",fa:"اثر-قدیمی"},year:2020,sortOrder:1};
 const newer:Artwork={...work,id:"w-new",slug:"work-new",localizedSlugs:{en:"work-new",fa:"اثر-جدید"},year:2024,sortOrder:1};
 const middle:Artwork={...work,id:"w-mid",slug:"work-mid",localizedSlugs:{en:"work-mid",fa:"اثر-میانی"},year:2024,sortOrder:2};
 assert.deepEqual(getPublicArtworks([older,newer,middle],"en").map(item=>item.id),["w-mid","w-new","w-old"]);
 const gallery=(id:string,slug:string,artwork:Artwork,sortOrder:number):Gallery=>({...validGallery,id,slug,localizedSlugs:{en:slug,fa:slug+"-fa"},coverArtworkId:artwork.id,artworkIds:[artwork.id],sortOrder});
 const galleriesToSort=[gallery("g-old","gallery-old",older,1),gallery("g-new","gallery-new",newer,1),gallery("g-mid","gallery-mid",middle,2)];
 assert.deepEqual(getPublicGalleries(galleriesToSort,[older,newer,middle],"en").map(item=>item.id),["g-mid","g-new","g-old"]);
});

test("localized artwork route matching accepts percent-encoded and canonically equivalent Persian slugs",()=>{
  const record={slug:"sample-window-moment",localizedSlugs:{en:"sample-window-moment",fa:"نمونه-پنجره"}};
  assert.equal(matchesLocalizedSlug(record,"fa","نمونه-پنجره"),true);
  assert.equal(matchesLocalizedSlug(record,"fa",encodeURIComponent("نمونه-پنجره")),true);
  assert.equal(matchesLocalizedSlug(record,"fa","نمونهٔ-پنجره"),false);
});

test("gallery requires unique published artwork members and member cover",()=>{const g:Gallery={id:"g1",slug:"gallery",title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:work.id,artworkIds:[work.id],status:"published",sortOrder:1};assert.equal(getPublicGalleries([g],[work],"en").length,1);assert.equal(getPublicGalleries([g],[],"en").length,0);assert.equal(getPublicGalleries([{...g,artworkIds:["w1","w1"]}],[work],"en").length,0);assert.equal(getPublicGalleries([{...g,coverArtworkId:"x"}],[work],"en").length,0);});
test("journal only exposes published entries with localized title and summary",()=>{const j:JournalEntry={id:"j1",slug:"story",type:"story",title:{en:"Story",fa:"داستان"},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true};assert.equal(getPublicJournal([j],"en").length,1);assert.equal(getPublicJournal([{...j,status:"draft"}],"en").length,0);assert.equal(getPublicJournal([j],"fa").length,1);});

test("event entries require a valid time zone and occurrence time",()=>{
 const base:JournalEntry={id:"e1",slug:"event",type:"event",title:{en:"Opening",fa:"افتتاحیه"},summary:{en:"An opening",fa:"افتتاحیه"},status:"published",approvedLocales:["en","fa"],artistApproved:true};
 assert.equal(getPublicJournal([base],"en").length,0);
 assert.equal(hasExplicitTimeZone("2026-11-12T18:00:00"),false);
 assert.equal(hasExplicitTimeZone("2026-11-12T18:00:00+01:00"),true);
 assert.equal(hasExplicitTimeZone("2026-11-12T17:00:00Z"),true);
 const valid:JournalEntry={...base,event:{startsAt:"2026-11-12T18:00:00+01:00",timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"}}};
 assert.equal(getPublicJournal([valid],"en").length,1);
 assert.equal(getPublicJournal([{...valid,event:{...valid.event!,timeZone:"Not/AZone"}}],"en").length,0);
 assert.equal(getPublicJournal([{...valid,event:{...valid.event!,startsAt:"2026-11-12T18:00:00"}}],"en").length,0);
});
test("Journal category filtering selects event and exhibition entries from synthetic records",()=>{
 const base:JournalEntry={...validJournalEntry};
 const entries:JournalEntry[]=[base,{...base,id:"e1",slug:"event-one",type:"event"},{...base,id:"x1",slug:"exhibition-one",type:"exhibition"},{...base,id:"draft",slug:"draft",status:"draft"}];
 assert.deepEqual(getJournalEntriesForCategory(entries,"event").map(item=>item.id),["e1"]);
 assert.deepEqual(getJournalEntriesForCategory(entries,"exhibition").map(item=>item.id),["x1"]);
});

test("CV entries resolve from localized editorial content without verification flags",()=>{
 const entry:CvEntry={id:"cv1",category:"group-exhibition",title:{en:"Group exhibition",fa:"نمایشگاه گروهی"},year:2024,status:"published"};
 assert.equal(getPublicCvEntries([entry],"en").length,1);
 assert.equal(getPublicCvEntries([{...entry,status:"draft"}],"en").length,0);
 assert.equal(getPublicCvEntries([{...entry,title:{en:"Group exhibition"}}],"fa").length,0);
 assert.equal(getPublicCvEntries([{id:"cv2",category:"other",title:{en:"Painting"},period:{en:"Current practice"},status:"published"}],"en").length,1);
});
test("homepage featured selection is explicit, ordered, unique, and publication-gated",()=>{
 const selection={featuredArtworkIds:["w1","w1","hidden"],featuredGalleryIds:[]};
 assert.deepEqual(getHomepageFeaturedArtworks([work,{...work,id:"hidden",status:"draft"}],selection,"en").map(item=>item.id),["w1"]);
});

test("journal category defaults preserve legacy articles and event taxonomy",()=>{
 const story:JournalEntry={id:"story",slug:"story",type:"story",title:{en:"Story",fa:"روایت"},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true};
 const exhibition:JournalEntry={...story,id:"exhibition",slug:"exhibition",type:"exhibition"};
 const studio:JournalEntry={...story,id:"studio",slug:"studio",type:"studio-update"};
 const event:JournalEntry={...story,id:"event",slug:"event",type:"event"};
 const all=[story,exhibition,studio,event];
 assert.deepEqual(getJournalEntriesForCategory(all,"story").map(x=>x.id),["story"]);
 assert.deepEqual(getJournalEntriesForCategory(all,"exhibition").map(x=>x.id),["exhibition"]);
 assert.deepEqual(getJournalEntriesForCategory(all,"studio-update").map(x=>x.id),["studio"]);
 assert.deepEqual(getJournalEntriesForCategory(all,"event").map(x=>x.id),["event"]);
 assert.equal(getJournalEntriesForCategory(all).length,4);
});

test("gallery cover resolves only to a public locale-ready canonical artwork",()=>{
 const gallery:Gallery={id:"g1",slug:"gallery",title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:"w1",artworkIds:["w1"],status:"published",sortOrder:1};
 assert.equal(getGalleryCoverArtwork(gallery,[work],"en")?.artwork.id,"w1");
 assert.equal(getGalleryCoverArtwork(gallery,[{...work,rightsConfirmed:false}],"en"),undefined);
 assert.equal(getGalleryCoverArtwork(gallery,[{...work,title:{en:"Work"}}],"fa"),undefined);
});

test("journal rich-text links allow only HTTPS or same-site root-relative destinations",()=>{
 assert.equal(isSafeJournalHref("/fa/works"),true);
 assert.equal(isSafeJournalHref("https://example.org/event"),true);
 assert.equal(isSafeJournalHref("javascript:alert(1)"),false);
 assert.equal(isSafeJournalHref("//example.org"),false);
 assert.equal(isSafeJournalHref("http://example.org"),false);
});

test("journal publication requires explicit artist approval and locale approval",()=>{
 const approved:JournalEntry={id:"approved",slug:"approved",type:"story",title:{en:"Story",fa:"روایت"},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en"],artistApproved:true};
 assert.equal(getPublicJournal([approved],"en").length,1);
 assert.equal(getPublicJournal([approved],"fa").length,0);
 assert.equal(getPublicJournal([{...approved,artistApproved:false}],"en").length,0);
 assert.equal(getPublicJournal([{...approved,approvedLocales:[]}],"en").length,0);
});

test("portfolio JSON-LD resolves localized artist identity from canonical profile JSON",()=>{
 const english=getPortfolioStructuredData("en")["@graph"];
 const persian=getPortfolioStructuredData("fa")["@graph"];
 const personEn=english[0] as Record<string,unknown>;
 const personFa=persian[0] as Record<string,unknown>;
 const website=english[1] as Record<string,unknown>;
 assert.equal(english.length,2);
 assert.equal(personEn["@type"],"Person");
  assert.equal(personEn.name,artistProfile?.name?.en);
  assert.equal(personEn.alternateName,artistProfile?.name?.fa);
 assert.equal(personEn.jobTitle,"Painter");
  assert.equal(personFa.name,artistProfile?.name?.fa);
  assert.equal(personFa.alternateName,artistProfile?.name?.en);
 assert.equal(personFa.jobTitle,"نقاش");
 assert.equal(website["@type"],"WebSite");
 assert.deepEqual(website.inLanguage,["fa","en"]);
 assert.deepEqual(website.publisher,{"@id":"https://nasoodi.art/#artist"});
 assert.equal("sameAs" in personEn,false);
});

test("locale switching resolves synthetic localized routes and falls back for unavailable content",async()=>{
 assert.equal(alternatePathFor("/fa","fa"),"/en");
 assert.equal(alternatePathFor("/fa/about","fa"),"/en/about");
 assert.equal(alternatePathFor("/fa/works","fa"),"/en/works");
 assert.equal(alternatePathFor("/fa/works/not-published","fa"),"/en");
 assert.equal(alternatePathFor("/fa/journal/not-published","fa"),"/en");
 assert.equal(alternatePathFor("/en/works/"+getLocalizedSlug(work,"en"),"en"),"/fa/works/"+getLocalizedSlug(work,"fa"));
});

test("homepage upcoming events are future-dated, locale-approved, and ordered by occurrence",()=>{
 const event=(id:string,startsAt:string):JournalEntry=>({
  id,slug:id,type:"event",title:{en:id,fa:id},summary:{en:"Summary",fa:"خلاصه"},
  status:"published",approvedLocales:["en","fa"],artistApproved:true,
  event:{startsAt,timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"}}
 });
 const now=new Date("2026-10-30T12:00:00Z");
 const items=[
  event("later","2026-11-20T18:00:00+01:00"),
  event("expired","2026-10-29T18:00:00+01:00"),
  event("soon","2026-11-02T18:00:00+01:00"),
  {...event("unapproved","2026-11-01T18:00:00+01:00"),approvedLocales:["fa"] as ("fa"|"en")[]}
 ];
 assert.deepEqual(getUpcomingJournalEvents(items,"en",now).map(item=>item.id),["soon","later"]);
 assert.deepEqual(getUpcomingJournalEvents(items,"fa",now).map(item=>item.id),["unapproved","soon","later"]);
});

test("VisualArtwork JSON-LD contains only confirmed localized artwork facts",()=>{
 const item:Artwork={...work,year:2022,medium:{en:"Oil on canvas",fa:"رنگ‌روغن روی بوم"},description:{en:"A quiet landscape",fa:"چشم‌اندازی آرام"}};
 const schema=getArtworkStructuredData(item,"en");
 assert.equal(schema["@type"],"VisualArtwork");
 assert.equal(schema.name,"Work");
 assert.equal(schema.artMedium,"Oil on canvas");
 assert.equal(schema.dateCreated,"2022");
 assert.equal(schema.image,"https://nasoodi.art/art/work.jpg");
 const sparse=getArtworkStructuredData(work,"fa");
 assert.equal(sparse.name,"اثر");
 assert.equal("dateCreated" in sparse,false);
 assert.equal("artMedium" in sparse,false);
 assert.equal("description" in sparse,false);
});
test("JSON-LD serialization escapes HTML-sensitive opening brackets",()=>{
 const serialized=serializeJsonLd({name:"</script><script>alert(1)</script>"});
 assert.equal(serialized.includes("</script>"),false);
 assert.equal(serialized.includes(String.fromCharCode(92)+"u003c/script>"),true);
});

test("artist profile resolves from localized canonical identity, statement, and biography",()=>{
 const profile:ArtistProfile={id:"profile-fixture",name:{en:"Artist",fa:"هنرمند"},statement:{en:"Statement",fa:"بیانیه"},biography:{en:"Biography",fa:"زندگی‌نامه"}};
 assert.equal(getPublicArtistProfile(profile,"en")?.statement.en,"Statement");
 assert.equal(getPublicArtistProfile({...profile,biography:{en:"Biography"}},"fa"),undefined);
 assert.equal(getPublicArtistProfile({...profile,name:{en:"Artist"}},"fa"),undefined);
});
test("artist portrait is omitted unless rights, dimensions, and localized alt are valid",()=>{
 const profile:ArtistProfile={id:"profile-fixture",name:{en:"Artist"},statement:{en:"Statement"},biography:{en:"Biography"},portrait:{src:"/artist.jpg",alt:{en:"Artist in studio"},width:800,height:1000,rightsConfirmed:true}};
 assert.equal(getPublicArtistProfile(profile,"en")?.portrait?.src,"/artist.jpg");
 assert.equal(getPublicArtistProfile({...profile,portrait:{...profile.portrait!,rightsConfirmed:false}},"en")?.portrait,undefined);
 assert.equal(getPublicArtistProfile({...profile,portrait:{...profile.portrait!,width:0}},"en")?.portrait,undefined);
});
test("canonical Contact record exposes only the artist-supplied Instagram destination",()=>{
 const details:ContactDetails={instagramUrl:"https://www.instagram.com/sampleprofile/"};
 assert.deepEqual(getPublicContactDetails(details),{
  instagramUrl:"https://www.instagram.com/sampleprofile/",
  instagramHandle:"sampleprofile",
 });
 assert.equal(getPublicContactDetails({email:"not-an-email",telegramHandle:"x",instagramUrl:"https://example.org/"}),undefined);
});
test("Journal Article structured data uses only localized visible editorial fields",()=>{
 const entry:JournalEntry={id:"story",slug:"story",type:"story",title:{en:"A story",fa:"روایت"},summary:{en:"A short summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true,publishedAt:"2026-10-20T10:00:00Z"};
 const schema=getJournalStructuredData(entry,"en","https://nasoodi.art/en/journal/story");
 assert.equal(schema["@type"],"Article");
 assert.equal(schema.headline,"A story");
 assert.equal(schema.description,"A short summary");
 assert.equal(schema.datePublished,"2026-10-20T10:00:00Z");
 assert.deepEqual(schema.author,{"@id":"https://nasoodi.art/#artist"});
});
test("Journal Event structured data includes confirmed dates, attendance mode, and venue only",()=>{
 const entry:JournalEntry={id:"event",slug:"event",type:"event",title:{en:"Opening",fa:"افتتاحیه"},summary:{en:"Opening night",fa:"شب افتتاحیه"},status:"published",approvedLocales:["en","fa"],artistApproved:true,event:{startsAt:"2026-11-12T18:00:00+01:00",endsAt:"2026-11-12T21:00:00+01:00",timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"},attendanceMode:"hybrid"}};
 const schema=getJournalStructuredData(entry,"en","https://nasoodi.art/en/journal/event");
 assert.equal(schema["@type"],"Event");
 assert.equal(schema.startDate,"2026-11-12T18:00:00+01:00");
 assert.equal(schema.endDate,"2026-11-12T21:00:00+01:00");
 assert.equal(schema.eventAttendanceMode,"https://schema.org/MixedEventAttendanceMode");
 assert.deepEqual(schema.location,{"@type":"Place",name:"Studio"});
 assert.equal("offers" in schema,false);
});

test("gallery structured data lists only its published localized artworks in editorial order",()=>{
 const gallery:Gallery={id:"g1",slug:"gallery",title:{en:"A collection",fa:"مجموعه"},description:{en:"A curated collection",fa:"مجموعه منتخب"},coverArtworkId:"w1",artworkIds:["w1","w2"],status:"published",sortOrder:1};
 const second:Artwork={...work,id:"w2",slug:"work-two",title:{en:"Second work",fa:"اثر دوم"},sortOrder:2};
 const hidden:Artwork={...work,id:"w3",slug:"hidden-work",title:{en:"Hidden",fa:"پنهان"},status:"needs-review"};
 const schema=getGalleryStructuredData(gallery,[work,second,hidden],"en","https://nasoodi.art/en/galleries/gallery");
 assert.equal(schema["@type"],"CollectionPage");
 assert.equal(schema.name,"A collection");
 const list=schema.mainEntity as {numberOfItems:number;itemListElement:Array<{position:number;item:{name:string;url:string}}>};
 assert.equal(list.numberOfItems,2);
 assert.deepEqual(list.itemListElement.map(item=>({position:item.position,name:item.item.name,url:item.item.url})),[
  {position:1,name:"Work",url:"https://nasoodi.art/en/works/work-one"},
  {position:2,name:"Second work",url:"https://nasoodi.art/en/works/work-two"},
 ]);
});

test("artwork images must use safe same-origin public paths",()=>{
 for(const path of ["https://example.org/image.jpg","//example.org/image.jpg","/../private.jpg","/%2e%2e/private.jpg","/images\\\\private.jpg","/image.jpg?redirect=https://example.org","/image.jpg#fragment","/images/%2f%2fexample.org/image.jpg"]){
  assert.equal(isSafeLocalImagePath(path),false,path);
 }
 assert.equal(isSafeLocalImagePath("/artworks/painting%20one.jpg"),true);
});

test("published route records reject unsafe slugs and duplicate public identities",()=>{
 assert.equal(isSafeContentSlug("work-one"),true);
 assert.equal(isSafeContentSlug("اثر-اول"),true);
 for(const slug of ["../private","two/segments","work?preview=1","work#fragment","work_name",""])assert.equal(isSafeContentSlug(slug),false,slug);
 const duplicateSlug:Artwork={...work,id:"w2",slug:work.slug,title:{en:"Duplicate",fa:"تکراری"}};
 const duplicateId:Artwork={...work,slug:"another-slug"};
 assert.equal(getPublicArtworks([work,duplicateSlug],"en").length,0);
 assert.equal(getPublicArtworks([work,duplicateId],"en").length,0);
 const gallery:Gallery={id:"g1",slug:"gallery",title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:"w1",artworkIds:["w1"],status:"published",sortOrder:1};
 assert.equal(getPublicGalleries([gallery,{...gallery,id:"g2"}],[work],"en").length,0);
 const story:JournalEntry={id:"j1",slug:"story",type:"story",title:{en:"Story"},summary:{en:"Summary"},status:"published",approvedLocales:["en"],artistApproved:true};
 assert.equal(getPublicJournal([story,{...story,id:"j2"}],"en").length,0);
 const cv:CvEntry={id:"cv1",category:"education",title:{en:"Education"},year:2020,status:"published"};
 assert.equal(getPublicCvEntries([cv,cv],"en").length,0);
});

test("Journal links reject protocol-relative, backslash-normalized, control, and credential URLs",()=>{
 assert.equal(isSafeJournalHref("/en/works/example"),true);
 assert.equal(isSafeJournalHref("https://example.org/event"),true);
 for(const href of ["//example.org","/\\\\example.org","/\\u0000bad","javascript:alert(1)","http://example.org","https://user:secret@example.org"]) {
  assert.equal(isSafeJournalHref(href),false,JSON.stringify(href));
 }
});

test("canonical artwork source records have unique identities", () => {
 // Editorial publication state, descriptions, translations, and image selection
 // are content data. Their publication rules are exercised with synthetic
 // fixtures above rather than requiring every current record to be published.
 assert.equal(new Set(artworks.map(item=>item.id)).size,artworks.length);
 assert.equal(new Set(artworks.map(item=>item.slug)).size,artworks.length);
});

test("canonical gallery source records have unique identities", () => {
 // Gallery membership is editorial curation: collections may overlap and
 // artworks may remain outside every gallery. Validate the publication rules
 // with synthetic records instead of constraining today's editorial dataset.
 assert.equal(new Set(galleries.map(item=>item.id)).size,galleries.length);
 assert.equal(new Set(galleries.map(item=>item.slug)).size,galleries.length);
});

test("gallery publication supports overlapping collections and unassigned artworks", () => {
 const second:Artwork={...work,id:"w2",slug:"work-two",title:{en:"Second work",fa:"اثر دوم"},sortOrder:2};
 const firstGallery:Gallery={id:"g1",slug:"first-gallery",title:{en:"First",fa:"اول"},description:{en:"First collection",fa:"مجموعه اول"},coverArtworkId:"w1",artworkIds:["w1","w2"],status:"published",sortOrder:1};
 const secondGallery:Gallery={id:"g2",slug:"second-gallery",title:{en:"Second",fa:"دوم"},description:{en:"Second collection",fa:"مجموعه دوم"},coverArtworkId:"w2",artworkIds:["w2"],status:"published",sortOrder:2};
 const unassigned:Artwork={...work,id:"w3",slug:"work-three",title:{en:"Unassigned",fa:"بدون مجموعه"}};
 const published=getPublicGalleries([firstGallery,secondGallery],[work,second,unassigned],"en");
 assert.deepEqual(new Set(published.map(gallery=>gallery.id)),new Set(["g1","g2"]));
 assert.equal(published.length,2);
});

test("homepage Journal preview selects only the newest published entry across article and event types", () => {
 const entry=(id:string,type:JournalEntry["type"],publishedAt:string):JournalEntry=>({id,slug:id,type,title:{en:id,fa:id},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true,publishedAt,...(type==="event"?{event:{startsAt:"2026-11-12T18:00:00+01:00",timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"}}}:{})});
 const items=[entry("old-story","story","2026-10-01T10:00:00Z"),entry("new-event","event","2026-10-29T10:00:00Z"),entry("middle-exhibition","exhibition","2026-10-15T10:00:00Z"),entry("newest-story","story","2026-10-30T10:00:00Z"),entry("local-later-date","story","2026-10-30T00:30:00+02:00"),entry("later-instant","exhibition","2026-10-29T23:00:00Z"),{...entry("draft","story","2026-10-31T10:00:00Z"),status:"draft" as const}];
 assert.deepEqual(getHomepageJournalPreview(items,"en").map(item=>item.id),["newest-story"]);
 assert.deepEqual(getHomepageJournalPreview(items,"fa").map(item=>item.id),["newest-story"]);
});


test("CV PDF publication requires an approved published same-origin PDF and safe filename",()=>{
 const document:CvDocument={src:"/documents/sample-cv.pdf",fileName:"sample-cv.pdf",artistApproved:true,status:"published"};
 assert.equal(getPublicCvDocument(document)?.src,"/documents/sample-cv.pdf");
 assert.equal(getPublicCvDocument({...document,artistApproved:false}),undefined);
 assert.equal(getPublicCvDocument({...document,status:"draft"}),undefined);
 assert.equal(getPublicCvDocument({...document,src:"https://example.org/cv.pdf"}),undefined);
 assert.equal(getPublicCvDocument({...document,src:"/documents/cv.txt"}),undefined);
 assert.equal(getPublicCvDocument({...document,fileName:"../cv.pdf"}),undefined);
 assert.equal(getPublicCvDocument(undefined),undefined);
});

test("CV publication accepts synthetic localized entries and optional periods",()=>{
 const entry:CvEntry={id:"cv-fixture",category:"group-exhibition",title:{en:"Group exhibition",fa:"نمایشگاه گروهی"},year:2024,status:"published"};
 assert.equal(getPublicCvEntries([entry],"en").length,1);
 assert.equal(getPublicCvEntries([{...entry,status:"draft"}],"en").length,0);
});

test("homepage Journal preview is composed from supplied synthetic entries",()=>{
 const entries=[validJournalEntry,{...validJournalEntry,id:"newer",slug:"newer",publishedAt:"2026-11-01T10:00:00Z"}];
 assert.equal(getHomepageJournalPreview(entries).length,1);
 assert.equal(getHomepageJournalPreview(entries)[0].id,"newer");
});

test("site shell renders artist identity from the canonical artist repository",()=>{
 const source=readFileSync("src/components/site-shell.tsx","utf8");
 assert.ok(source.includes("getArtist(locale)"));
 assert.match(source,/artistBrand/);
});

test("artist profile publication validates supplied localized profile fixtures",()=>{
 assert.ok(getPublicArtistProfile(validArtistProfile,"en"));
 assert.ok(getPublicArtistProfile(validArtistProfile,"fa"));
 assert.equal(getPublicArtistProfile({...validArtistProfile,biography:{en:"Biography"}},"fa"),undefined);
});

test("upcoming Journal event selection excludes ongoing events and uses stable tie-breakers", () => {
 const now=new Date("2026-11-01T12:00:00Z");
 const makeEvent=(id:string,startsAt:string,endsAt?:string,type:JournalEntry["type"]="event"):JournalEntry=>({
  id,slug:id,type,title:{en:id,fa:id},summary:{en:"Summary",fa:"خلاصه"},status:"published",
  approvedLocales:["en","fa"],artistApproved:true,
  event:{startsAt,timeZone:"Europe/London",venue:{en:"Gallery",fa:"گالری"},...(endsAt?{endsAt}:{})}
 });
 const items=[
  makeEvent("ongoing","2026-11-01T10:00:00Z","2026-11-01T14:00:00Z"),
  makeEvent("later","2026-11-03T10:00:00Z"),
  makeEvent("tie-b","2026-11-02T10:00:00Z"),
  makeEvent("tie-a","2026-11-02T10:00:00Z","2026-11-02T12:00:00Z","exhibition"),
  makeEvent("past","2026-10-30T10:00:00Z","2026-10-30T12:00:00Z"),
  {...makeEvent("unapproved","2026-11-01T13:00:00Z"),artistApproved:false},
  {...makeEvent("untranslated","2026-11-01T13:00:00Z"),approvedLocales:[]}
 ];
 assert.deepEqual(getUpcomingJournalEvents(items,"en",now).map(item=>item.id),["tie-a","tie-b","later"]);
 assert.equal(getUpcomingJournalEvent(items,"en",now)?.id,"tie-a");
 assert.equal(getUpcomingJournalEvent(items,"fa",now)?.id,"tie-a");
});
test("Journal ordering uses stable identity tie-breakers for equal publication instants",()=>{
 const make=(id:string):JournalEntry=>({id,slug:id,type:"story",title:{en:id},summary:{en:"Summary"},status:"published",approvedLocales:["en"],artistApproved:true,publishedAt:"2026-10-30T10:00:00Z"});
 assert.deepEqual(getPublicJournal([make("z-entry"),make("a-entry")],"en").map(item=>item.id),["a-entry","z-entry"]);
});

test("Journal cover images require a safe local path, explicit rights, dimensions, and localized alt text",()=>{
 const entry:JournalEntry={id:"journal-cover",slug:"journal-cover",type:"event",title:{en:"Opening",fa:"افتتاحیه"},summary:{en:"A gathering",fa:"دیداری"},status:"published",approvedLocales:["en","fa"],artistApproved:true,event:{startsAt:"2026-11-12T18:00:00+01:00",timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"}}};
 const cover={src:"/images/journal/sample-event-cover.jpg",alt:{en:"Visitors viewing paintings at an open studio",fa:"بازدیدکنندگان در آتلیه باز در حال تماشای نقاشی‌ها"},width:1600,height:1200,rightsConfirmed:true};
 assert.deepEqual(journalCoverImageFor({...entry,coverImage:cover},"en"),cover);
 assert.deepEqual(journalCoverImageFor({...entry,coverImage:cover},"fa"),cover);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,rightsConfirmed:false}},"en"),undefined);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,src:"https://example.org/event.jpg"}},"en"),undefined);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,width:0}},"en"),undefined);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,alt:{en:"",fa:""}}},"en"),undefined);
});


test("Journal cover publication validates synthetic rights-cleared image records",()=>{
 const entry:JournalEntry={...validJournalEntry,coverImage:{src:"/journal/cover.jpg",alt:{en:"Cover",fa:"تصویر"},width:800,height:600,rightsConfirmed:true}};
 assert.equal(journalCoverImageFor(entry,"en")?.src,"/journal/cover.jpg");
 assert.equal(journalCoverImageFor(entry,"fa")?.src,"/journal/cover.jpg");
 assert.equal(journalCoverImageFor({...entry,coverImage:{...entry.coverImage!,rightsConfirmed:false}},"en"),undefined);
});

test("localized content slugs are validated and unique independently per locale",()=>{
 const localizedWork:Artwork={...work,localizedSlugs:{en:"spring-garden",fa:"bagh-bahar"}};
 assert.equal(getLocalizedSlug(localizedWork,"en"),"spring-garden");
 assert.equal(getLocalizedSlug(localizedWork,"fa"),"bagh-bahar");
 assert.equal(getPublicArtworks([localizedWork],"en").length,1);
 assert.equal(getPublicArtworks([localizedWork],"fa").length,1);
 const duplicateEnglish:Artwork={...localizedWork,id:"w2",localizedSlugs:{en:"spring-garden",fa:"bagh-bahar-second"}};
 assert.equal(getPublicArtworks([localizedWork,duplicateEnglish],"en").length,0);
 assert.equal(getPublicArtworks([localizedWork,duplicateEnglish],"fa").length,2);

 const gallery:Gallery={id:"g1",slug:"legacy-gallery",localizedSlugs:{en:"quiet-intervals",fa:"faslehaye-aram"},title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:"w1",artworkIds:["w1"],status:"published",sortOrder:1};
 assert.equal(getPublicGalleries([gallery],[work],"en").length,1);
 assert.equal(getLocalizedSlug(gallery,"fa"),"faslehaye-aram");

 const journal:JournalEntry={id:"j1",slug:"legacy-story",localizedSlugs:{en:"studio-notes",fa:"yaddasht-haye-ateliye"},type:"story",title:{en:"Story",fa:"داستان"},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true};
 assert.equal(getPublicJournal([journal],"en").length,1);
 assert.equal(getLocalizedSlug(journal,"fa"),"yaddasht-haye-ateliye");
});


test("a missing localized slug never falls back to another locale and fails synthetic validation",()=>{
 const localized={...work,localizedSlugs:{en:"english-only"}};
 assert.equal(getLocalizedSlug(localized,"en"),"english-only");
 assert.equal(getLocalizedSlug(localized,"fa"),"");
 const issues=validatePortfolioContent({...validPortfolioSource,artworks:[localized]});
 assert.ok(issues.some(issue=>issue.path.endsWith(".localizedSlugs.fa")));
});

test("localized slugs are unique per locale and alternate links follow synthetic stable content ids",async()=>{
 const localizedWork:Artwork={...work,id:"localized-route-work",slug:"legacy-work",localizedSlugs:{en:"english-work",fa:"persian-work"}};
 const localizedGallery:Gallery={...validGallery,id:"localized-route-gallery",slug:"legacy-gallery",localizedSlugs:{en:"english-gallery",fa:"persian-gallery"},coverArtworkId:localizedWork.id,artworkIds:[localizedWork.id]};
 const localizedJournal:JournalEntry={...validJournalEntry,id:"localized-route-journal",slug:"legacy-journal",localizedSlugs:{en:"english-journal",fa:"persian-journal"}};
 const duplicateGallery:Gallery={...localizedGallery,id:"localized-route-gallery-duplicate",localizedSlugs:{en:"english-gallery",fa:"another-persian-gallery"}};
 const duplicateJournal:JournalEntry={...localizedJournal,id:"localized-route-journal-duplicate",localizedSlugs:{en:"english-journal",fa:"another-persian-journal"}};
 assert.equal(getPublicGalleries([localizedGallery,duplicateGallery],[localizedWork],"en").length,0);
 assert.equal(getPublicGalleries([localizedGallery,duplicateGallery],[localizedWork],"fa").length,2);
 assert.equal(getPublicJournal([localizedJournal,duplicateJournal],"en").length,0);
 assert.equal(getPublicJournal([localizedJournal,duplicateJournal],"fa").length,2);
 assert.equal(alternatePathFor("/en/works/english-work","en"),"/fa/works/persian-work");
 assert.equal(alternatePathFor("/en/galleries/english-gallery","en"),"/fa/galleries/persian-gallery");
 assert.equal(alternatePathFor("/en/journal/english-journal","en"),"/fa/journal/persian-journal");
});

test("portfolio validation requires complete localized Journal bodies for published records",()=>{
 const entry:JournalEntry={...validJournalEntry,body:{en:validJournalEntry.body?.en}};
 const issues=validatePortfolioContent({...validPortfolioSource,journalEntries:[entry]});
 assert.ok(issues.some(issue=>issue.path.endsWith(".body.fa")));
});

test("synthetic portfolio registry passes cross-record validation",()=>{
 assert.deepEqual(validatePortfolioContent(validPortfolioSource),[]);
});

test("portfolio validation reports duplicate identities and broken synthetic relationships",()=>{
 const duplicateArtwork={...work};
 const brokenGallery={...validGallery,artworkIds:["missing-artwork"],coverArtworkId:"missing-artwork"};
 const issues=validatePortfolioContent({
  ...validPortfolioSource,
  artworks:[work,duplicateArtwork],
  galleries:[brokenGallery],
  homepageSelection:{...validPortfolioSource.homepageSelection,featuredArtworkIds:[work.id,"missing-artwork"]},
 });
 assert.ok(issues.some(issue=>issue.path.endsWith(".id")&&issue.message.includes("Duplicate artworks ID")));
 assert.ok(issues.some(issue=>issue.path.includes("artworkIds")&&issue.message.includes("Unknown artwork ID")));
 assert.ok(issues.some(issue=>issue.path.includes("featuredArtworkIds")&&issue.message.includes("Unknown content ID")));
});

test("archive hreflang requires the same published content identities in both locales", () => {
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"b"}],[{id:"b"},{id:"a"}]),true);
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"b"}],[{id:"a"}]),false);
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"b"}],[{id:"a"},{id:"c"}]),false);
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"a"}],[{id:"a"},{id:"a"}]),false);
 assert.equal(hasEquivalentContentSet([],[]),false);
});

test("CV identifiers are validated independently from URL slugs",()=>{
 const cvEntry:CvEntry={id:"cv_entry_01",category:"education",title:{en:"Fine Arts"},year:2020,status:"draft"};
 const issues=validatePortfolioContent({...validPortfolioSource,cvEntries:[cvEntry]});
 assert.deepEqual(issues,[]);
});

test("synthetic portfolio validation enforces localized editorial fields and safe relationships",()=>{
 const invalidEntry:JournalEntry={...validJournalEntry,body:{en:validJournalEntry.body?.en},coverImage:{src:"https://example.org/cover.jpg",alt:{en:"Cover"},width:640,height:480,rightsConfirmed:true}};
 const issues=validatePortfolioContent({...validPortfolioSource,journalEntries:[invalidEntry]});
 assert.ok(issues.some(issue=>issue.path.endsWith(".body.fa")));
 assert.ok(issues.some(issue=>issue.path.endsWith(".coverImage.src")));
});

test("announcement configuration validates both activation states and rejects malformed fields", () => {
  assertAnnouncementConfig(announcementConfig);
  const base = {
    active: true,
    type: "gallery" as const,
    contentId: "synthetic-gallery",
    title: { en: "Featured content", fa: "محتوای منتخب" },
    description: { en: "A short description.", fa: "توضیح کوتاه." },
  };
  assert.doesNotThrow(() => assertAnnouncementConfig(base));
  assert.doesNotThrow(() => assertAnnouncementConfig({ ...base, active: false }));
  assert.throws(() => assertAnnouncementConfig({ ...base, active: "true" }));
  assert.throws(() => assertAnnouncementConfig({ ...base, type: "unknown" }));
  assert.throws(() => assertAnnouncementConfig({ ...base, contentId: " " }));
  assert.throws(() => assertAnnouncementConfig({ ...base, title: { en: "", fa: "عنوان" } }));
  assert.throws(() => assertAnnouncementConfig({ ...base, description: { en: "Description" } }));
  assert.throws(() => assertAnnouncementConfig({ ...base, metadata: {} }));
  assert.throws(() => assertAnnouncementConfig({ ...base, href: "/en/galleries/example" }));
});

test("announcement destinations are derived from content type and localized slug", () => {
  assert.equal(getAnnouncementHref("artwork", "sample-work", "en"), "/en/works/sample-work");
  assert.equal(getAnnouncementHref("gallery", "sample-gallery", "en"), "/en/galleries/sample-gallery");
  assert.equal(getAnnouncementHref("journal", "sample-story", "en"), "/en/journal/sample-story");
  assert.equal(getAnnouncementHref("event", "sample-event", "en"), "/en/journal/sample-event");
  assert.equal(getAnnouncementHref("artwork", "نمونه اثر", "fa"), "/fa/works/%D9%86%D9%85%D9%88%D9%86%D9%87%20%D8%A7%D8%AB%D8%B1");
});

test("announcement destination resolution is independent of production editorial records",()=>{
 assert.equal(getAnnouncementHref("gallery","synthetic-gallery","en"),"/en/galleries/synthetic-gallery");
 assert.equal(getAnnouncementHref("gallery","synthetic-gallery","fa"),"/fa/galleries/synthetic-gallery");
});

