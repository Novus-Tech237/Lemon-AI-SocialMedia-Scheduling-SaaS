import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ChannelTypeEnum, getChannelIcon, getChannelUrl } from "@/constants/channels";

const socials = [
  ChannelTypeEnum.TWITTER,
  ChannelTypeEnum.LINKEDIN,
  ChannelTypeEnum.INSTAGRAM,
  ChannelTypeEnum.YOUTUBE,
  ChannelTypeEnum.FACEBOOK,
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Channels", href: "#channels" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Help center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "API docs", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Customers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/30">
      {/* CTA band */}
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-14 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Ready to streamline your social media?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Plan once, publish everywhere. Get started free — no credit card required.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href="/sign-up">Get started for free</Link>
          </Button>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Plan, customize, and schedule content across every social platform — with AI built into every step.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((type) => {
                const icon = getChannelIcon(type);
                return (
                  <Link
                    key={type}
                    href={getChannelUrl(type)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ANA AI on ${type.toLowerCase()}`}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {icon && <HugeiconsIcon icon={icon} color="currentColor" className="size-4" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} ANA AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
