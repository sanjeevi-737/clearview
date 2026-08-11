import type { ScrapedSite, ClutterResult } from "../types/index.js";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function evaluateClutter(site: ScrapedSite): ClutterResult {
  const issues: string[] = [];
  const linkCount = site.links.length;
  const buttonCount = site.buttons.length;
  const navLinks = site.navigation.reduce((acc, nav) => acc + nav.links, 0);

  const seen = new Map<string, number>();
  for (const block of site.blocks) {
    const key = `${block.tag}|${block.text.slice(0, 80)}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  const repeatedCount = Array.from(seen.values()).reduce(
    (acc, count) => acc + (count > 1 ? count - 1 : 0),
    0
  );

  let linkScore = 0;
  if (linkCount > 100) {
    linkScore = 40;
    issues.push(`${linkCount} links detected — likely link overload`);
  } else if (linkCount > 60) {
    linkScore = 25;
    issues.push(`${linkCount} links detected — above recommended density`);
  }

  let buttonScore = 0;
  if (buttonCount > 15) {
    buttonScore = 20;
    issues.push(`${buttonCount} buttons found — excessive call-to-action competition`);
  } else if (buttonCount > 8) {
    buttonScore = 10;
    issues.push(`${buttonCount} buttons found — consider consolidating`);
  }

  let repeatScore = 0;
  if (repeatedCount > 6) {
    repeatScore = 25;
    issues.push(`${repeatedCount} repeated blocks detected — near-duplicate content`);
  } else if (repeatedCount > 2) {
    repeatScore = 12;
    issues.push(`${repeatedCount} repeated blocks detected`);
  }

  let menuScore = 0;
  const largeMenu = site.navigation.find((nav) => nav.links > 15);
  if (largeMenu) {
    menuScore = 15;
    issues.push(
      `"${largeMenu.label}" menu has ${largeMenu.links} links — navigation complexity risk`
    );
  } else if (navLinks > 24) {
    menuScore = 10;
    issues.push(`Navigation exposes ${navLinks} links — consider grouping`);
  }

  const rawScore = linkScore + buttonScore + repeatScore + menuScore;
  const score = clamp(Math.round(rawScore), 0, 100);

  return {
    score,
    issues: issues.slice(0, 10),
  };
}
