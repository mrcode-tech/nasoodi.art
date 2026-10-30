import assert from "node:assert/strict";
import test from "node:test";
import { getPublicArtworks,getPublicGalleries,getPublicJournal,getPublicCvEntries,getHomepageFeaturedArtworks,getGalleryCoverArtwork,type Artwork,type Gallery,type JournalEntry,type CvEntry } from "../src/lib/site";
const work:Artwork={id:"w1",slug:"work-one",title:{en:"Work",fa:"اثر"},images:[{src:"/art/work.jpg",alt:{en:"Painting",fa:"نقاشی"},role:"primary",width:1200,height:900}],rightsConfirmed:true,status:"published"};
test("artwork stays private until published and rights-cleared",()=>{assert.equal(getPublicArtworks([{...work,status:"needs-review"}],"en").length,0);assert.equal(getPublicArtworks([{...work,rightsConfirmed:false}],"en").length,0);assert.equal(getPublicArtworks([work],"en").length,1);});
test("artwork requires localized title and primary image alt",()=>{assert.equal(getPublicArtworks([{...work,title:{en:"Work"}}],"fa").length,0);assert.equal(getPublicArtworks([{...work,images:[{...work.images[0],alt:{en:""}}]}],"en").length,0);});
test("gallery requires unique published artwork members and member cover",()=>{const g:Gallery={id:"g1",slug:"gallery",title:{en:"Gallery",fa:"گالری"},description:{en:"Description",fa:"توضیح"},coverArtworkId:"w1",artworkIds:["w1"],status:"published",sortOrder:1};assert.equal(getPublicGalleries([g],[work],"en").length,1);assert.equal(getPublicGalleries([g],[],"en").length,0);assert.equal(getPublicGalleries([{...g,artworkIds:["w1","w1"]}],[work],"en").length,0);assert.equal(getPublicGalleries([{...g,coverArtworkId:"x"}],[work],"en").length,0);});
test("journal only exposes published entries with localized title and summary",()=>{const j:JournalEntry={id:"j1",slug:"story",type:"article",title:{en:"Story",fa:"داستان"},summary:{en:"Summary",fa:"خلاصه"},status:"published"};assert.equal(getPublicJournal([j],"en").length,1);assert.equal(getPublicJournal([{...j,status:"draft"}],"en").length,0);assert.equal(getPublicJournal([j],"fa").length,1);});

test("event entries require a valid time zone and occurrence time",()=>{
 const base:JournalEntry={id:"e1",slug:"event",type:"event",title:{en:"Opening",fa:"افتتاحیه"},summary:{en:"An opening",fa:"افتتاحیه"},status:"published"};
 assert.equal(getPublicJournal([base],"en").length,0);
 const valid:JournalEntry={...base,event:{startsAt:"2026-11-12T18:00:00",timeZone:"Europe/Berlin",venue:{en:"Studio",fa:"آتلیه"}}};
 assert.equal(getPublicJournal([valid],"en").length,1);
 assert.equal(getPublicJournal([{...valid,event:{...valid.event!,timeZone:"Not/AZone"}}],"en").length,0);
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
 const story:JournalEntry={id:"story",slug:"story",type:"article",title:{en:"Story",fa:"روایت"},summary:{en:"Summary",fa:"خلاصه"},status:"published"};
 const exhibition:JournalEntry={...story,id:"exhibition",slug:"exhibition",category:"exhibition"};
 const studio:JournalEntry={...story,id:"studio",slug:"studio",category:"studio-update"};
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
