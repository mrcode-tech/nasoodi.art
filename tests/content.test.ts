import assert from "node:assert/strict";
import test from "node:test";
import { artworks } from "../src/content/artworks";
import { galleries } from "../src/content/galleries";
import { journalEntries } from "../src/content/journal";
import { homepageSelection } from "../src/content/homepage";
import { artistProfile } from "../src/content/artist";
import { cvDocument, cvEntries } from "../src/content/cv";
import { portfolioStructuredData } from "../src/content/portfolio-structured-data";
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
import { getLocalizedSlug, isSafeLocalImagePath, isSafeContentSlug } from "../src/lib/content/paths";
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
const work:Artwork={id:"w1",slug:"work-one",title:{en:"Work",fa:"اثر"},images:[{src:"/art/work.jpg",alt:{en:"Painting",fa:"نقاشی"},role:"primary",width:1200,height:900}],rightsConfirmed:true,status:"published"};
test("artwork stays private until published and rights-cleared",()=>{assert.equal(getPublicArtworks([{...work,status:"needs-review"}],"en").length,0);assert.equal(getPublicArtworks([{...work,rightsConfirmed:false}],"en").length,0);assert.equal(getPublicArtworks([work],"en").length,1);});
test("artwork requires localized title and primary image alt",()=>{assert.equal(getPublicArtworks([{...work,title:{en:"Work"}}],"fa").length,0);assert.equal(getPublicArtworks([{...work,images:[{...work.images[0],alt:{en:""}}]}],"en").length,0);});
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

test("portfolio JSON-LD describes only confirmed artist and website facts",()=>{
 const graph=portfolioStructuredData["@graph"];
 const person=graph[0] as Record<string,unknown>;
 const website=graph[1] as Record<string,unknown>;
 assert.equal(graph.length,2);
 assert.equal(person["@type"],"Person");
 assert.equal(person.name,"Ghazaleh Abdolahzade Nasoodi");
 assert.equal(person.alternateName,"غزاله عبداله زاده نسودی");
 assert.equal(person.jobTitle,"Oil painter");
 assert.equal(website["@type"],"WebSite");
 assert.deepEqual(website.inLanguage,["fa","en"]);
 assert.deepEqual(website.publisher,{"@id":"https://nasoodi.art/#artist"});
 assert.equal("sameAs" in person,false);
});

test("locale switching preserves available localized sections and falls back for unavailable content", async () => {
 assert.equal(alternatePathFor("/fa", "fa"), "/en");
 assert.equal(alternatePathFor("/fa/about", "fa"), "/en/about");
 assert.equal(alternatePathFor("/fa/works", "fa"), "/en/works");
 assert.equal(alternatePathFor("/fa/works/not-published", "fa"), "/en");
 assert.equal(alternatePathFor("/fa/journal/not-published", "fa"), "/en");
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
 const profile:ArtistProfile={id:"artist-profile",name:{en:"Artist",fa:"هنرمند"},statement:{en:"Statement",fa:"بیانیه"},biography:{en:"Biography",fa:"زندگی‌نامه"}};
 assert.equal(getPublicArtistProfile(profile,"en")?.statement.en,"Statement");
 assert.equal(getPublicArtistProfile({...profile,biography:{en:"Biography"}},"fa"),undefined);
 assert.equal(getPublicArtistProfile({...profile,name:{en:"Artist"}},"fa"),undefined);
});
test("artist portrait is omitted unless rights, dimensions, and localized alt are valid",()=>{
 const profile:ArtistProfile={id:"artist-profile",name:{en:"Artist"},statement:{en:"Statement"},biography:{en:"Biography"},portrait:{src:"/artist.jpg",alt:{en:"Artist in studio"},width:800,height:1000,rightsConfirmed:true}};
 assert.equal(getPublicArtistProfile(profile,"en")?.portrait?.src,"/artist.jpg");
 assert.equal(getPublicArtistProfile({...profile,portrait:{...profile.portrait!,rightsConfirmed:false}},"en")?.portrait,undefined);
 assert.equal(getPublicArtistProfile({...profile,portrait:{...profile.portrait!,width:0}},"en")?.portrait,undefined);
});
test("canonical Contact record exposes only the artist-supplied Instagram destination",()=>{
 const details:ContactDetails={instagramUrl:"https://www.instagram.com/ghazalenasoodi/"};
 assert.deepEqual(getPublicContactDetails(details),{
  instagramUrl:"https://www.instagram.com/ghazalenasoodi/",
  instagramHandle:"ghazalenasoodi",
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

test("the five owner-approved gallery assets are represented by five unique published artwork records", () => {
 assert.equal(artworks.length,5);
 assert.equal(new Set(artworks.map(item=>item.id)).size,5);
 assert.equal(new Set(artworks.map(item=>item.slug)).size,5);
 for (const [index,item] of artworks.entries()) {
  assert.equal(item.status,"published");
  assert.equal(item.rightsConfirmed,true);
  assert.equal(item.images.length,1);
  assert.equal(item.images[0].src,`/images/approved-artwork-${index+1}.jpg`);
  assert.equal(item.images[0].role,"primary");
  assert.ok(item.images[0].width>0 && item.images[0].height>0);
  for (const locale of ["en","fa"] as const) {
   assert.ok(item.title[locale]?.trim());
   assert.ok(item.description?.[locale]?.trim());
   assert.ok(item.images[0].alt[locale]?.trim());
  }
 }
 assert.deepEqual(getPublicArtworks(artworks,"en").map(item=>item.id),artworks.map(item=>item.id));
 assert.deepEqual(getPublicArtworks(artworks,"fa").map(item=>item.id),artworks.map(item=>item.id));
});

test("four curated collections publish valid ordered memberships with shared artwork identities", () => {
 assert.equal(galleries.length,4);
 assert.equal(new Set(galleries.map(item=>item.id)).size,4);
 assert.equal(new Set(galleries.map(item=>item.slug)).size,4);
 for (const gallery of galleries) {
  assert.equal(gallery.status,"published");
  assert.ok(gallery.title.en?.trim() && gallery.title.fa?.trim());
  assert.ok(gallery.description.en?.trim() && gallery.description.fa?.trim());
  assert.ok(gallery.artworkIds.length>=3);
  assert.ok(gallery.artworkIds.includes(gallery.coverArtworkId));
  assert.ok(gallery.artworkIds.every(id=>artworks.some(item=>item.id===id)));
  assert.equal(new Set(gallery.artworkIds).size,gallery.artworkIds.length);
 }
 const memberships=artworks.map(item=>galleries.filter(gallery=>gallery.artworkIds.includes(item.id)).length);
 assert.ok(memberships.every(count=>count>=2),"each canonical artwork should be reused across multiple collections");
 assert.equal(getPublicGalleries(galleries,artworks,"en").length,4);
 assert.equal(getPublicGalleries(galleries,artworks,"fa").length,4);
 assert.deepEqual(homepageSelection.featuredArtworkIds,artworks.map(item=>item.id));
 assert.equal(homepageSelection.featuredGalleryIds.length,4);
});

test("homepage Journal preview selects only the newest published entry across article and event types", () => {
 const entry=(id:string,type:JournalEntry["type"],publishedAt:string):JournalEntry=>({id,slug:id,type,title:{en:id,fa:id},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true,publishedAt,...(type==="event"?{event:{startsAt:"2026-11-12T18:00:00+01:00",timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"}}}:{})});
 const items=[entry("old-story","story","2026-10-01T10:00:00Z"),entry("new-event","event","2026-10-29T10:00:00Z"),entry("middle-exhibition","exhibition","2026-10-15T10:00:00Z"),entry("newest-story","story","2026-10-30T10:00:00Z"),entry("local-later-date","story","2026-10-30T00:30:00+02:00"),entry("later-instant","exhibition","2026-10-29T23:00:00Z"),{...entry("draft","story","2026-10-31T10:00:00Z"),status:"draft" as const}];
 assert.deepEqual(getHomepageJournalPreview(items,"en").map(item=>item.id),["newest-story"]);
 assert.deepEqual(getHomepageJournalPreview(items,"fa").map(item=>item.id),["newest-story"]);
});


test("CV PDF publication requires an approved published same-origin PDF and safe filename",()=>{
 const document:CvDocument={src:"/documents/artist-cv.pdf",fileName:"artist-cv.pdf",artistApproved:true,status:"published"};
 assert.equal(getPublicCvDocument(document)?.src,"/documents/artist-cv.pdf");
 assert.equal(getPublicCvDocument({...document,artistApproved:false}),undefined);
 assert.equal(getPublicCvDocument({...document,status:"draft"}),undefined);
 assert.equal(getPublicCvDocument({...document,src:"https://example.org/cv.pdf"}),undefined);
 assert.equal(getPublicCvDocument({...document,src:"/documents/cv.txt"}),undefined);
 assert.equal(getPublicCvDocument({...document,fileName:"../cv.pdf"}),undefined);
 assert.equal(getPublicCvDocument(undefined),undefined);
});

test("canonical CV record contains localized editable entries",()=>{
 assert.ok(cvEntries.length>0);
 for(const entry of cvEntries){
  assert.ok(entry.id);
  assert.ok(entry.title.en?.trim());
  assert.ok(entry.title.fa?.trim());
  assert.ok(entry.period?.en?.trim() || entry.year);
  assert.ok(entry.period?.fa?.trim() || entry.year);
 }
});

test("canonical artist profile is populated in both locales",()=>{
 assert.ok(artistProfile);
 assert.equal(artistProfile?.id,"artist-profile");
 assert.ok(artistProfile?.name?.en?.trim());
 assert.ok(artistProfile?.name?.fa?.trim());
 assert.ok(artistProfile?.biography.en?.trim());
 assert.ok(artistProfile?.biography.fa?.trim());
 assert.ok(artistProfile?.statement.en?.trim());
 assert.ok(artistProfile?.statement.fa?.trim());
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
 const cover={src:"/images/journal/open-studio.jpg",alt:{en:"Visitors viewing paintings at an open studio",fa:"بازدیدکنندگان در آتلیه باز در حال تماشای نقاشی‌ها"},width:1600,height:1200,rightsConfirmed:true};
 assert.deepEqual(journalCoverImageFor({...entry,coverImage:cover},"en"),cover);
 assert.deepEqual(journalCoverImageFor({...entry,coverImage:cover},"fa"),cover);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,rightsConfirmed:false}},"en"),undefined);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,src:"https://example.org/event.jpg"}},"en"),undefined);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,width:0}},"en"),undefined);
 assert.equal(journalCoverImageFor({...entry,coverImage:{...cover,alt:{en:"",fa:""}}},"en"),undefined);
});


test("published Journal entries use localized, dimensioned, rights-cleared temporary gallery-image placeholders",()=>{
 for(const locale of ["en","fa"] as const){
  const entries=getPublicJournal(journalEntries,locale);
  assert.equal(entries.length,8);
  for(const entry of entries){
   const cover=journalCoverImageFor(entry,locale);
   assert.ok(cover,entry.slug+" should have a Journal image");
   assert.equal(cover.rightsConfirmed,true);
   assert.equal(isSafeLocalImagePath(cover.src),true);
   assert.ok(cover.width>0&&cover.height>0);
   assert.match(cover.alt[locale] ?? "",locale==="en"?/Temporary Journal image placeholder/:/تصویر موقت/);
  }
 }
 const withoutCover={...journalEntries[0],coverImage:undefined};
 assert.equal(journalCoverImageFor(withoutCover,"en"),undefined);
 const unapprovedCover={...journalEntries[0],coverImage:{...journalEntries[0].coverImage!,rightsConfirmed:false}};
 assert.equal(journalCoverImageFor(unapprovedCover,"en"),undefined);
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


test("localized slugs are unique per locale and alternate links follow stable content ids",async()=>{
 const localizedWork:Artwork={...artworks[0],id:"localized-route-work",slug:"legacy-work",localizedSlugs:{en:"english-work",fa:"persian-work"}};
 const localizedGallery:Gallery={id:"localized-route-gallery",slug:"legacy-gallery",localizedSlugs:{en:"english-gallery",fa:"persian-gallery"},title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:localizedWork.id,artworkIds:[localizedWork.id],status:"published",sortOrder:99};
 const localizedJournal:JournalEntry={id:"localized-route-journal",slug:"legacy-journal",localizedSlugs:{en:"english-journal",fa:"persian-journal"},type:"story",title:{en:"Story",fa:"داستان"},summary:{en:"Summary",fa:"خلاصه"},status:"published",approvedLocales:["en","fa"],artistApproved:true};
 const duplicateGallery:Gallery={...localizedGallery,id:"localized-route-gallery-duplicate",localizedSlugs:{en:"english-gallery",fa:"another-persian-gallery"}};
 const duplicateJournal:JournalEntry={...localizedJournal,id:"localized-route-journal-duplicate",localizedSlugs:{en:"english-journal",fa:"another-persian-journal"}};
 artworks.push(localizedWork);
 galleries.push(localizedGallery);
 journalEntries.push(localizedJournal);
 try {
  assert.equal(getPublicGalleries([localizedGallery,duplicateGallery],[localizedWork],"en").length,0);
  assert.equal(getPublicGalleries([localizedGallery,duplicateGallery],[localizedWork],"fa").length,2);
  assert.equal(getPublicJournal([localizedJournal,duplicateJournal],"en").length,0);
  assert.equal(getPublicJournal([localizedJournal,duplicateJournal],"fa").length,2);
  assert.equal(alternatePathFor("/en/works/english-work","en"),"/fa/works/persian-work");
  assert.equal(alternatePathFor("/en/galleries/english-gallery","en"),"/fa/galleries/persian-gallery");
  assert.equal(alternatePathFor("/en/journal/english-journal","en"),"/fa/journal/persian-journal");
 } finally {
  artworks.pop();
  galleries.pop();
  journalEntries.pop();
 }
});

test("published Journal records require a complete localized JSON body",()=>{
 const entry=journalEntries[0];
 const issues=validatePortfolioContent({
  artworks,galleries,journalEntries:[{...entry,body:{en:entry.body?.en}}],
  cvEntries,homepageSelection,artistProfile,cvDocument,
 });
 assert.ok(issues.some((issue)=>issue.path.endsWith(".body.fa")));
});

test("canonical portfolio registry passes cross-record validation", () => {
 const issues = validatePortfolioContent({
  artworks,
  galleries,
  journalEntries,
  cvEntries,
  homepageSelection,
  artistProfile,
  cvDocument,
 });
 assert.deepEqual(issues, []);
});

test("portfolio validation reports duplicate routes and broken content relationships", () => {
 const duplicateArtwork = { ...artworks[0], slug: "different-fallback-slug" };
 const brokenGallery = { ...galleries[0], artworkIds: ["missing-artwork"], coverArtworkId: "missing-artwork" };
 const issues = validatePortfolioContent({
  artworks: [...artworks, duplicateArtwork],
  galleries: [brokenGallery],
  journalEntries,
  cvEntries: [],
  homepageSelection: { ...homepageSelection, featuredArtworkIds: [...homepageSelection.featuredArtworkIds, "missing-artwork"] },
  artistProfile,
  cvDocument,
 });
 assert.ok(issues.some((issue) => issue.path.endsWith(".id") && issue.message.includes("Duplicate artworks ID")));
 assert.ok(issues.some((issue) => issue.path.includes("artworkIds") && issue.message.includes("Unknown artwork ID")));
 assert.ok(issues.some((issue) => issue.path.includes("featuredArtworkIds") && issue.message.includes("Unknown content ID")));
});

test("archive hreflang requires the same published content identities in both locales", () => {
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"b"}],[{id:"b"},{id:"a"}]),true);
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"b"}],[{id:"a"}]),false);
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"b"}],[{id:"a"},{id:"c"}]),false);
 assert.equal(hasEquivalentContentSet([{id:"a"},{id:"a"}],[{id:"a"},{id:"a"}]),false);
 assert.equal(hasEquivalentContentSet([],[]),false);
});

test("CV identifiers are validated independently from URL slugs", () => {
 const cvEntry: CvEntry = {
  id: "cv_entry_01",
  category: "education",
  title: { en: "Fine Arts" },
  year: 2020,
  
  status: "draft",
 };
 const issues = validatePortfolioContent({
  artworks,
  galleries,
  journalEntries,
  cvEntries: [cvEntry],
  homepageSelection,
  artistProfile,
  cvDocument,
 });
 assert.deepEqual(issues, []);
});


test("JSON editorial records preserve bilingual Journal bodies and rich-text semantics", () => {
 assert.equal(artworks.length, 5);
 assert.equal(galleries.length, 4);
 assert.equal(journalEntries.length, 8);
 const first = journalEntries.find((entry) => entry.id === "journal-studio-notes-november-2026");
 assert.ok(first?.body?.en && first.body.fa);
 assert.equal(first.body.en[0].type, "paragraph");
 assert.equal(first.body.en[0].type === "paragraph" ? first.body.en[0].text : "", "The studio has been full of unfinished conversations between colour and surface. Some passages are built slowly, with thin layers that allow earlier marks to remain present; others ask for a more decisive gesture.");
 assert.deepEqual(first.body.en[1], { type: "heading", level: 2, text: "Leaving room for the painting" });
 assert.deepEqual(first.body.en[3], { type: "quote", text: "Sometimes the most important decision is to leave a little space untouched." });
 assert.equal(first.body.fa[0].type === "paragraph" ? first.body.fa[0].text : "", "این روزها آتلیه پر از گفت‌وگوهای ناتمام میان رنگ و سطح است. بعضی بخش‌ها با لایه‌های نازک و آرام شکل می‌گیرند تا ردّ رنگ‌های پیشین باقی بماند؛ بخش‌های دیگر به حرکتی قاطع‌تر نیاز دارند.");
 assert.equal(journalEntries.find((entry) => entry.id === "journal-exhibition-open-studio-2026")?.event?.startsAt, "2026-11-14T14:00:00+00:00");
 for (const entry of journalEntries) {
  assert.ok(entry.body?.en?.length, entry.id + " must have an English JSON rich-text body");
  assert.ok(entry.body?.fa?.length, entry.id + " must have a Persian JSON rich-text body");
  assert.ok(entry.coverImage?.rightsConfirmed, entry.id + " must resolve an approved artwork cover");
 }
});
