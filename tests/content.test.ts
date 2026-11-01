import assert from "node:assert/strict";
import test from "node:test";
import { aboutPreviewFixture } from "../src/lib/about-preview-fixtures";
import { artworks,galleries,homepageSelection,getPublicArtworks,getPublicGalleries,isSafeLocalImagePath,isSafeContentSlug,getPublicJournal,getPublicCvEntries,getPublicCvDocument,getPublicArtistProfile,getPublicContactDetails,getUpcomingJournalEvents,getUpcomingJournalEvent,getArtworkStructuredData,getGalleryStructuredData,getJournalStructuredData,serializeJsonLd,getHomepageFeaturedArtworks,getGalleryCoverArtwork,getJournalEntriesForCategory,getHomepageJournalPreview,isSafeJournalHref,portfolioStructuredData,type Artwork,type Gallery,type JournalEntry,type CvEntry,type CvDocument,type ArtistProfile,type ContactDetails, hasExplicitTimeZone } from "../src/lib/site";
const work:Artwork={id:"w1",slug:"work-one",title:{en:"Work",fa:"اثر"},images:[{src:"/art/work.jpg",alt:{en:"Painting",fa:"نقاشی"},role:"primary",width:1200,height:900}],rightsConfirmed:true,status:"published"};
test("artwork stays private until published and rights-cleared",()=>{assert.equal(getPublicArtworks([{...work,status:"needs-review"}],"en").length,0);assert.equal(getPublicArtworks([{...work,rightsConfirmed:false}],"en").length,0);assert.equal(getPublicArtworks([work],"en").length,1);});
test("artwork requires localized title and primary image alt",()=>{assert.equal(getPublicArtworks([{...work,title:{en:"Work"}}],"fa").length,0);assert.equal(getPublicArtworks([{...work,images:[{...work.images[0],alt:{en:""}}]}],"en").length,0);});
test("gallery requires unique published artwork members and member cover",()=>{const g:Gallery={id:"g1",slug:"gallery",title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:"w1",artworkIds:["w1"],status:"published",sortOrder:1};assert.equal(getPublicGalleries([g],[work],"en").length,1);assert.equal(getPublicGalleries([g],[],"en").length,0);assert.equal(getPublicGalleries([{...g,artworkIds:["w1","w1"]}],[work],"en").length,0);assert.equal(getPublicGalleries([{...g,coverArtworkId:"x"}],[work],"en").length,0);});
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
test("CV entries require explicit verification and localized titles",()=>{
 const entry:CvEntry={id:"cv1",category:"group-exhibition",title:{en:"Group exhibition",fa:"نمایشگاه گروهی"},year:2024,verified:true,status:"published"};
 assert.equal(getPublicCvEntries([entry],"en").length,1);
 assert.equal(getPublicCvEntries([{...entry,verified:false}],"en").length,0);
 assert.equal(getPublicCvEntries([{...entry,title:{en:"Group exhibition"}}],"fa").length,0);
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
 const { alternatePathFor } = await import("../src/lib/site");
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

test("artist profile requires published artist approval and complete localized statement and biography",()=>{
 const profile:ArtistProfile={statement:{en:"Statement",fa:"بیانیه"},biography:{en:"Biography",fa:"زندگی‌نامه"},status:"published",approvedLocales:["en","fa"],artistApproved:true};
 assert.equal(getPublicArtistProfile(profile,"en")?.statement.en,"Statement");
 assert.equal(getPublicArtistProfile({...profile,artistApproved:false},"en"),undefined);
 assert.equal(getPublicArtistProfile({...profile,biography:{en:"Biography"}},"fa"),undefined);
 assert.equal(getPublicArtistProfile({...profile,status:"draft"},"en"),undefined);
});
test("artist portrait is omitted unless rights, dimensions, and localized alt are valid",()=>{
 const profile:ArtistProfile={statement:{en:"Statement"},biography:{en:"Biography"},status:"published",approvedLocales:["en"],artistApproved:true,portrait:{src:"/artist.jpg",alt:{en:"Artist in studio"},width:800,height:1000,rightsConfirmed:true}};
 assert.equal(getPublicArtistProfile(profile,"en")?.portrait?.src,"/artist.jpg");
 assert.equal(getPublicArtistProfile({...profile,portrait:{...profile.portrait!,rightsConfirmed:false}},"en")?.portrait,undefined);
 assert.equal(getPublicArtistProfile({...profile,portrait:{...profile.portrait!,width:0}},"en")?.portrait,undefined);
});
test("contact destinations require owner and locale approval and safe values",()=>{
 const details:ContactDetails={email:"artist@example.org",instagramUrl:"https://www.instagram.com/ghazalenasoodi/",approvedLocales:["en","fa"],ownerApproved:true};
 assert.equal(getPublicContactDetails(details,"en")?.email,"artist@example.org");
 assert.equal(getPublicContactDetails({...details,ownerApproved:false},"en"),undefined);
 assert.equal(getPublicContactDetails({...details,approvedLocales:["fa"]},"en"),undefined);
 assert.equal(getPublicContactDetails({...details,instagramUrl:"javascript:alert(1)",email:undefined},"en"),undefined);
 assert.equal(getPublicContactDetails({...details,instagramUrl:"https://example.org",email:undefined},"en"),undefined);
 assert.equal(getPublicContactDetails({...details,email:"not-an-email",instagramUrl:undefined},"en"),undefined);
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
 const cv:CvEntry={id:"cv1",category:"education",title:{en:"Education"},year:2020,verified:true,status:"published"};
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

test("long About preview fixtures are bilingual, clearly sample-only, and include CV layout rows",()=>{
 assert.ok(aboutPreviewFixture.biography.en.length>700);
 assert.ok(aboutPreviewFixture.biography.en.split(/\s+/).length>=250);
 assert.ok(aboutPreviewFixture.biography.fa.length>500);
 assert.equal(aboutPreviewFixture.cv.length,16);
 assert.notEqual(aboutPreviewFixture.statement.en,aboutPreviewFixture.biography.en);
 assert.ok(aboutPreviewFixture.statement.en.split(/\s+/).length>=150 && aboutPreviewFixture.statement.en.split(/\s+/).length<=220);
 assert.ok(aboutPreviewFixture.statement.en.includes("invented editorial sample"));
 assert.deepEqual(new Set(aboutPreviewFixture.cv.map(entry=>entry.category)),new Set(["education","exhibition","publication","award","practice"]));
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
test("homepage Journal ordering uses stable identity tie-breakers for equal publication instants",()=>{
 const make=(id:string):JournalEntry=>({id,slug:id,type:"story",title:{en:id},summary:{en:"Summary"},status:"published",approvedLocales:["en"],artistApproved:true,publishedAt:"2026-10-30T10:00:00Z"});
 assert.deepEqual(getHomepageJournalPreview([make("z-entry"),make("a-entry")],"en").map(item=>item.id),["a-entry","z-entry"]);
});
