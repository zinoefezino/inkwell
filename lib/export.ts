// Client-side export helpers — turns generated text into a polished
// .docx or .pdf document and triggers a browser download.
// No server round-trip needed.

interface ExportOptions {
  title?: string; // e.g. the applicant's name, shown as a document header
  subtitle?: string; // e.g. "Proposal" or "Tailored CV"
}

// Splits generated text into paragraphs, and — for CVs — detects likely
// section headings (short lines in ALL CAPS, or ending without punctuation,
// followed by content) so they render as real headings rather than plain text.
function parseBlocks(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.map((line) => {
    const isHeading =
      line.length < 60 &&
      (line === line.toUpperCase() ||
        /^[A-Z][A-Za-z0-9 &/-]{2,40}:?$/.test(line)) &&
      !line.endsWith(".");
    return { text: line.replace(/:$/, ""), heading: isHeading };
  });
}

export async function downloadAsDocx(
  text: string,
  filename: string,
  opts: ExportOptions = {},
) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } =
    await import("docx");
  const blocks = parseBlocks(text);

  const children = [];

  if (opts.title) {
    children.push(
      new Paragraph({
        text: opts.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.LEFT,
        spacing: { after: 60 },
      }),
    );
  }
  if (opts.subtitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: opts.subtitle, italics: true, color: "6B6B63" }),
        ],
        spacing: { after: 240 },
      }),
    );
  }

  blocks.forEach((b) => {
    if (b.heading) {
      children.push(
        new Paragraph({
          text: b.text,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
      );
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: b.text, size: 22 })],
          spacing: { after: 140 },
        }),
      );
    }
  });

  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: { run: { font: "Georgia", size: 22 } },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${filename}.docx`);
}

export async function downloadAsPdf(
  text: string,
  filename: string,
  opts: ExportOptions = {},
) {
  const { jsPDF } = await import("jspdf");
  const blocks = parseBlocks(text);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 56;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  if (opts.title) {
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    ensureSpace(28);
    doc.text(opts.title, margin, y);
    y += 26;
  }

  if (opts.subtitle) {
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(107, 107, 99);
    ensureSpace(20);
    doc.text(opts.subtitle, margin, y);
    doc.setTextColor(20, 23, 31);
    y += 26;
  }

  blocks.forEach((b) => {
    if (b.heading) {
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      ensureSpace(24);
      y += 8;
      doc.text(b.text, margin, y);
      y += 18;
    } else {
      doc.setFont("times", "normal");
      doc.setFontSize(11.5);
      const lines = doc.splitTextToSize(b.text, maxWidth);
      lines.forEach((line: string) => {
        ensureSpace(16);
        doc.text(line, margin, y);
        y += 16;
      });
      y += 6;
    }
  });

  doc.save(`${filename}.pdf`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
