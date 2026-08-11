import Link from "next/link";
import { Globe, MessageCircle, Send, Heart } from "lucide-react";
import Logo from "@/components/logo";

const PRODUCT_LINKS = [
  { label: "AI Summary", href: "#features" },
  { label: "Structure Mapping", href: "#features" },
  { label: "Readability", href: "#features" },
  { label: "Clutter Detection", href: "#features" },
  { label: "Developer API", href: "#features" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

const RESOURCE_LINKS = [
  { label: "Documentation", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="section-shell grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="#top" className="flex items-center gap-2.5" aria-label="ClearView AI home">
            <Logo />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-white">
                ClearView
              </span>
              <span className="text-[10px] font-medium tracking-[0.22em] text-indigo-400">
                AI
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            AI-powered website simplification and structure visualization.
            See any site clearly, in seconds.
          </p>
          <div className="mt-6 flex gap-2.5">
            {[
              { icon: MessageCircle, label: "Community" },
              { icon: Globe, label: "Website" },
              { icon: Send, label: "Contact" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-indigo-400/40 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <LinkColumn title="Product" links={PRODUCT_LINKS} />
        <LinkColumn title="Company" links={COMPANY_LINKS} />
        <LinkColumn title="Resources" links={RESOURCE_LINKS} />
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="section-shell flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ClearView AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-red-400/70 text-red-400/70" /> for a
            simpler web — by sanjeevikumar
          </p>
        </div>
      </div>
    </footer>
  );
}
