import { aboutPreviewFixture } from "@/lib/about-preview-fixtures";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7e]/g, "?");
}

function createSamplePdf() {
  const labels: Record<string, string> = {
    education: "EDUCATION & TRAINING",
    exhibition: "SELECTED EXHIBITIONS",
    publication: "PUBLICATIONS",
    award: "AWARDS & RECOGNITION",
    practice: "ARTISTIC PRACTICE",
  };
  const commands: string[] = ["0 g"];
  let y = 790;
  const line = (value: string, size = 9, indent = 54) => {
    commands.push(`BT /F1 ${size} Tf 1 0 0 1 ${indent} ${y} Tm (${pdfEscape(value)}) Tj ET`);
    y -= size + 7;
  };
  line("GHAZALEH ABDOLAHZADE NASOODI", 18);
  line("FICTIONAL SAMPLE — FOR DESIGN REVIEW ONLY — NOT AN AUTHENTIC ARTIST CV", 8);
  y -= 14;
  line("All biographical and professional details in this document are invented placeholders.", 8);
  y -= 12;
  const categories = ["education", "exhibition", "publication", "award", "practice"];
  for (const category of categories) {
    const entries = aboutPreviewFixture.cv.filter((entry) => entry.category === category);
    if (!entries.length) continue;
    line(labels[category], 11);
    y -= 2;
    for (const entry of entries) {
      line(`${entry.year}  ${entry.title.en}`, 8, 62);
      line(entry.organization.en, 7, 76);
      if (entry.location?.en) line(entry.location.en, 7, 76);
      y -= 2;
    }
    y -= 8;
  }
  line("FICTIONAL SAMPLE — FOR DESIGN REVIEW ONLY — NOT AN AUTHENTIC ARTIST CV", 8);
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`,
  ];
  let output = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(Buffer.byteLength(output, "ascii"));
    output += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(output, "ascii");
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info << /Title (Fictional Sample CV - Design Review Only) /Author (Nasoodi.art sample content) >> >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(output, "ascii");
}

export async function GET() {
  const pdf = createSamplePdf();
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ghazaleh-abdolahzade-nasoodi-sample-cv.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
