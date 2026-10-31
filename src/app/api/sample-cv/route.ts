import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function textLine(value: string, x: number, y: number, size: number) {
  return `BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${pdfEscape(value)}) Tj ET`;
}

function createFictionalSamplePdf() {
  const commands = [
    "q",
    "0.91 g",
    "BT /F1 29 Tf 0.94 0.34 -0.34 0.94 108 390 Tm (FICTIONAL SAMPLE - PREVIEW ONLY) Tj ET",
    "Q",
    "0 g",
    textLine("GHAZALEH ABDOLAHZADE NASOODI", 54, 786, 20),
    textLine("FICTIONAL SAMPLE CV  |  NOT A REAL ARTIST CV", 54, 760, 10),
    textLine("PROFILE", 54, 710, 11),
    textLine("This invented profile is provided only to demonstrate the sample About-page layout.", 54, 690, 9),
    textLine("No biographical or professional claim in this document is factual or approved.", 54, 676, 9),
    textLine("EDUCATION AND TRAINING", 54, 632, 11),
    textLine("20XX  Foundations of Oil Painting - Atelier Studies Programme (fictional)", 54, 610, 9),
    textLine("SELECTED EXHIBITIONS AND PRESENTATIONS", 54, 568, 11),
    textLine("20XX  Quiet Arrangements - The Rooms Project Space (fictional group show)", 54, 546, 9),
    textLine("20XX  Notes on Stillness - Open Studio Week (fictional presentation)", 54, 530, 9),
    textLine("RESIDENCIES AND PROJECTS", 54, 488, 11),
    textLine("20XX  Light and Surface - The North Room Studio (fictional residency)", 54, 466, 9),
    textLine("PUBLICATIONS", 54, 424, 11),
    textLine("20XX  A Small Atlas of Looking - Paper & Pigment Editions (fictional)", 54, 402, 9),
    textLine("SAMPLE CONTENT NOTICE", 54, 340, 11),
    textLine("Every date, institution, exhibition, programme and publication above is invented.", 54, 320, 9),
    textLine("This PDF is generated for preview testing and must never be presented as a real CV.", 54, 304, 9),
    textLine("Nasoodi.art - development preview only", 54, 58, 8),
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(commands, "ascii")} >>\nstream\n${commands}\nendstream`,
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
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(output, "ascii");
}

export async function GET(request: NextRequest) {
  const previewAllowed = process.env.NODE_ENV !== "production" || process.env.GITHUB_ACTIONS === "true";
  if (!previewAllowed || request.nextUrl.searchParams.get("preview") !== "sample") {
    return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }
  const pdf = createFictionalSamplePdf();
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ghazaleh-abdolahzade-nasoodi-fictional-sample-cv.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
