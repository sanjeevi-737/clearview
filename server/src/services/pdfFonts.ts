import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FONT_DIR = path.resolve(__dirname, "../../fonts");

const FONT_FILES: Record<string, string> = {
  tamil: "NotoSansTamil.ttf",
  cjk: "NotoSansJP-Regular.ttf",
  emoji: "NotoEmoji.ttf",
};

const available = new Set<string>();

type Script = "latin" | "tamil" | "cjk" | "emoji";

function scriptOf(codePoint: number): Script {
  if (
    (codePoint >= 0x1f000 && codePoint <= 0x1faff) ||
    (codePoint >= 0x2600 && codePoint <= 0x27bf) ||
    codePoint === 0x200d ||
    codePoint === 0xfe0f
  ) {
    return "emoji";
  }
  if (codePoint >= 0x0b80 && codePoint <= 0x0bff) return "tamil";
  if (
    (codePoint >= 0x3000 && codePoint <= 0x30ff) ||
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) ||
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xff00 && codePoint <= 0xffef)
  ) {
    return "cjk";
  }
  return "latin";
}

export function splitRuns(text: string): string[] {
  const runs: string[] = [];
  let current = "";
  let currentScript: Script | null = null;
  for (const char of Array.from(text)) {
    const cp = char.codePointAt(0) ?? 0;
    const script = scriptOf(cp);
    if (script !== currentScript) {
      if (current) runs.push(current);
      current = char;
      currentScript = script;
    } else {
      current += char;
    }
  }
  if (current) runs.push(current);
  return runs;
}

export function fontNameFor(text: string): string {
  const first = Array.from(text)[0];
  const script = first ? scriptOf(first.codePointAt(0) ?? 0) : "latin";
  const name = script === "latin" ? "Helvetica" : script;
  return name !== "Helvetica" && !available.has(name)
    ? "Helvetica"
    : name;
}

export function hasUnicodeFonts(): boolean {
  return available.size > 0;
}

export function registerFonts(doc: PDFKit.PDFDocument): void {
  for (const [name, file] of Object.entries(FONT_FILES)) {
    if (available.has(name)) continue;
    const fontPath = path.join(FONT_DIR, file);
    if (!fs.existsSync(fontPath)) continue;
    try {
      doc.registerFont(name, fontPath);
      available.add(name);
      logger.info(`Registered PDF font ${name} (${file})`);
    } catch (err) {
      logger.warn(`Failed to register PDF font ${file}`, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

export function drawText(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number
): void {
  const runs = splitRuns(text);
  if (runs.length === 0) return;
  doc.fontSize(fontSize);
  runs.forEach((run, i) => {
    doc.font(fontNameFor(run));
    if (i === 0) {
      doc.text(run, x, y, { width, continued: i < runs.length - 1 });
    } else {
      doc.text(run, { width, continued: i < runs.length - 1 });
    }
  });
}
