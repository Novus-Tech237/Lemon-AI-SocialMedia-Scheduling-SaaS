"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CreditCard, Lightbulb, Plus, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CreatePostDialog from "@/components/schedule/create-post-dialog";

const navItems = [
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const NavLink = ({ name, href, icon: Icon }: { name: string; href: string; icon: LucideIcon }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 rounded-full py-1 text-muted-foreground transition-colors",
        isActive && "text-primary"
      )}
    >
      <Icon className={cn("size-5", isActive && "animate-bounce")} />
      <span className="text-[10px] font-medium">{name}</span>
    </Link>
  );
};

const MobileNav = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 md:hidden">
        <nav className="flex items-center justify-evenly gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-1.5 shadow-lg backdrop-blur-xl dark:bg-secondary/60">
          <NavLink {...navItems[0]} />
          <NavLink {...navItems[1]} />

          <button
            type="button"
            onClick={() => setIsCreatePostOpen(true)}
            aria-label="New post"
            className="flex size-12 shrink-0 -translate-y-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform active:scale-95"
          >
            <Plus className="size-5" />
          </button>

          <NavLink {...navItems[2]} />
          <NavLink {...navItems[3]} />
        </nav>
      </div>

      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </>
  );
};

export default MobileNav;
