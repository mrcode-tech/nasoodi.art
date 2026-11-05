import { cvEntries } from "@/content/cv";
import { artistProfile } from "@/content/artist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapePdf(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7e]/g, "?");
}

function wrap(value: string, max = 88): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (next.length > max && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function createPdf() {
  const headings: Record<string, string> = {
    education: "EDUCATION & TRAINING",
    "solo-exhibition": "SOLO EXHIBITIONS",
    "group-exhibition": "GROUP EXHIBITIONS",
    award: "AWARDS & RECOGNITION",
    publication: "PUBLICATIONS",
    collection: "COLLECTIONS",
    other: "ARTISTIC PRACTICE",
  };
  const groups = ["education", "solo-exhibition", "group-exhibition", "publication", "award", "collection", "other"];
  const lines: Array<{ text: string; size: number; indent: number; gap: number }> = [];
  const add = (text: string, size = 9, indent = 54, gap = size + 3) => lines.push({ text, size, indent, gap });
  add("GHAZALEH ABDOLAHZADE NASOODI", 18, 54, 26);
  add("CURRICULUM VITAE", 10, 54, 20);
  const intro = artistProfile?.discipline?.en ?? "Oil Painter";
  add(intro.toUpperCase(), 9, 54, 18);
  for (const category of groups) {
    const entries = cvEntries.filter((entry) => entry.status === "published" && entry.category === category)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (!entries.length) continue;
    add(headings[category], 11, 54, 18);
    for (const entry of entries) {
      const date = entry.year ? String(entry.year) : entry.period?.en ?? "";
      for (const part of wrap([date, entry.title.en].filter(Boolean).join("  —  "))) add(part, 9, 62, 12);
      if (entry.organization?.en) for (const part of wrap(entry.organization.en)) add(part, 8, 76, 10);
      if (entry.location?.en) add(entry.location.en, 8, 76, 12);
      lines.push({ text: "", size: 1, indent: 54, gap: 4 });
    }
    lines.push({ text: "", size: 1, indent: 54, gap: 7 });
  }

  const pages: typeof lines[] = [];
  let page: typeof lines = [];
  let y = 790;
  for (const line of lines) {
    if (y - line.gap < 54 && page.length) { pages.push(page); page = []; y = 790; }
    page.push(line);
    y -= line.gap;
  }
  if (page.length) pages.push(page);

  const objects: string[] = [];
  const addObject = (value: string) => { objects.push(value); return objects.length; };
  const catalogId = addObject("");
  const pagesId = addObject("");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];
  for (const pageLines of pages) {
    let yPos = 790;
    const commands = ["0 g"];
    for (const line of pageLines) {
      if (line.text) commands.push(`BT /F1 ${line.size} Tf 1 0 0 1 ${line.indent} ${yPos} Tm (${escapePdf(line.text)}) Tj ET`);
      yPos -= line.gap;
    }
    const stream = commands.join("\n");
    const streamId = addObject(`<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`);
    pageIds.push(addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`));
  }
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => id + " 0 R").join(" ")}] /Count ${pageIds.length} >>`;
  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(output, "ascii"));
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(output, "ascii");
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(output, "ascii");
}

export async function GET() {
  const pdf = createPdf();
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ghazaleh-abdolahzade-nasoodi-cv.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
