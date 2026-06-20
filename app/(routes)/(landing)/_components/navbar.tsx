"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/dark-mode-toggle";

const navItems = ["Features", "About", "Pricing"];

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // Solidify the floating pill once the page is scrolled past the top.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-4 z-50 px-4"
    >
      <div
        className={`mx-auto max-w-6xl rounded-2xl border px-5 py-3 backdrop-blur-md transition-all duration-300 ${
          isScrolled
            ? "border-border/80 bg-background/95 shadow-xl"
            : "border-border/60 bg-background/80 shadow-lg"
        }`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>{item}</span>
                {item !== "Pricing" && <ChevronDown className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ModeToggle />
            {!isSignedIn ? (
              <>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button asChild className="rounded-full px-5">
                  <Link href="/sign-up">Get started for free</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="rounded-full px-5">
                  <Link href="/schedule">Open workspace</Link>
                </Button>
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
              </>
            )}
          </div>

          {/* Mobile actions: theme toggle + animated hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="relative flex size-9 items-center justify-center rounded-lg border border-border/60 text-foreground transition-colors hover:bg-muted"
            >
              <Menu
                className={`absolute size-5 transition-all duration-300 ${
                  isMenuOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                className={`absolute size-5 transition-all duration-300 ${
                  isMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile collapsible menu */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "max-h-120 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mt-4 flex flex-col">
            {navItems.map((item, idx) => (
              <button
                key={item}
                onClick={closeMenu}
                style={{
                  animation: isMenuOpen
                    ? `slideIn 0.3s ease-out ${0.06 * (idx + 1)}s both`
                    : "none",
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span>{item}</span>
                {item !== "Pricing" && <ChevronDown className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          {/* Mobile auth actions */}
          <div
            style={{
              animation: isMenuOpen
                ? `slideIn 0.3s ease-out ${0.06 * (navItems.length + 1)}s both`
                : "none",
            }}
            className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-4"
          >
            {!isSignedIn ? (
              <>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/sign-in" onClick={closeMenu}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-full">
                  <Link href="/sign-up" onClick={closeMenu}>
                    Get started for free
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <Button asChild className="rounded-full px-5">
                  <Link href="/schedule" onClick={closeMenu}>
                    Open workspace
                  </Link>
                </Button>
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
