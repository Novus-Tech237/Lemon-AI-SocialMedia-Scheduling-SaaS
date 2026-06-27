"use client";

import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

const MobileHeader = () => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-6 backdrop-blur-md md:hidden">
      <Logo />
      <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
    </header>
  );
};

export default MobileHeader;
