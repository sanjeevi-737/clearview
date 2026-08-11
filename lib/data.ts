export type SiteNode = {
  id: string;
  label: string;
  detail: string;
  type: "root" | "section" | "page";
  stats: number;
  color: string;
};

export const SITE_NODES: SiteNode[] = [
  {
    id: "root",
    label: "acme.io",
    detail: "Home",
    type: "root",
    stats: 100,
    color: "#6366F1",
  },
  {
    id: "nav",
    label: "Navigation",
    detail: "12 links · consistent",
    type: "section",
    stats: 92,
    color: "#8B5CF6",
  },
  {
    id: "hero",
    label: "Hero",
    detail: "Clear headline · strong CTA",
    type: "section",
    stats: 96,
    color: "#06B6D4",
  },
  {
    id: "features",
    label: "Features",
    detail: "3-column grid · scannable",
    type: "section",
    stats: 88,
    color: "#8B5CF6",
  },
  {
    id: "pricing",
    label: "Pricing",
    detail: "4 tiers · 2 competitors",
    type: "page",
    stats: 76,
    color: "#06B6D4",
  },
  {
    id: "blog",
    label: "Blog",
    detail: "24 posts · great reading",
    type: "section",
    stats: 94,
    color: "#8B5CF6",
  },
  {
    id: "about",
    label: "About",
    detail: "Mission · team · press",
    type: "page",
    stats: 81,
    color: "#6366F1",
  },
  {
    id: "contact",
    label: "Contact",
    detail: "Form · map · links",
    type: "page",
    stats: 69,
    color: "#06B6D4",
  },
];

export const STRUCTURE_EDGES: Array<{ source: string; target: string }> = [
  { source: "root", target: "nav" },
  { source: "root", target: "hero" },
  { source: "root", target: "features" },
  { source: "root", target: "blog" },
  { source: "root", target: "about" },
  { source: "root", target: "pricing" },
  { source: "root", target: "contact" },
  { source: "nav", target: "pricing" },
  { source: "nav", target: "contact" },
  { source: "hero", target: "pricing" },
  { source: "features", target: "pricing" },
  { source: "blog", target: "about" },
];

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "About", href: "#creator" },
];
