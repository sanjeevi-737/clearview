import type {
  ScrapedSite,
  HierarchyNode,
  StructureGraph,
} from "../types/index.js";
import { truncate } from "../utils/sanitize.js";

type StackEntry = { node: HierarchyNode; level: number };

export function buildStructure(site: ScrapedSite): StructureGraph {
  const host = new URL(site.url).hostname.replace(/^www\./, "");
  const rootLabel = site.title || host || site.url;

  const root: HierarchyNode = { id: "root", label: rootLabel, children: [] };
  const nodes: StructureGraph["nodes"] = [{ id: "root", label: rootLabel }];
  const edges: StructureGraph["edges"] = [];

  const addChild = (
    parent: HierarchyNode,
    child: HierarchyNode,
    parentId: string
  ) => {
    parent.children = parent.children ?? [];
    parent.children.push(child);
    nodes.push({ id: child.id, label: child.label, parent: parentId });
    edges.push({ source: parentId, target: child.id });
  };

  if (site.navigation.length > 0) {
    const navNode: HierarchyNode = {
      id: "nav",
      label: "Navigation",
      children: [],
    };
    site.navigation.slice(0, 10).forEach((nav, i) => {
      addChild(
        navNode,
        {
          id: `nav-${i}`,
          label: truncate(nav.label || `Menu ${i + 1}`, 40),
        },
        "nav"
      );
    });
    addChild(root, navNode, "root");
  }

  const stack: StackEntry[] = [{ node: root, level: 0 }];
  const headings = site.headings.filter((h) => h.text.trim());
  let sectionIndex = 0;

  for (const heading of headings) {
    const level = Math.min(Math.max(heading.level, 1), 6);
    while (stack.length > 1 && stack[stack.length - 1]!.level >= level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1]!;
    const id = `section-${sectionIndex++}`;
    const node: HierarchyNode = {
      id,
      label: truncate(heading.text, 60),
      children: [],
    };
    addChild(parent.node, node, parent.node.id);
    stack.push({ node, level });
  }

  const contentAnchor = stack[stack.length - 1]!.node;
  const paragraphLimit = Math.min(site.paragraphs.length, 8);
  for (let i = 0; i < paragraphLimit; i++) {
    const text = site.paragraphs[i] ?? "";
    if (!text.trim()) continue;
    addChild(
      contentAnchor,
      {
        id: `text-${i}`,
        label: truncate(text, 90),
      },
      contentAnchor.id
    );
  }

  return { tree: root, nodes, edges };
}
