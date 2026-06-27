"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Check } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChannelTypeEnum, getChannelIcon } from "@/constants/channels";
import Threads from "./threads";
import Lightfall from "../lightfall";

const platformBadges = [
  { type: ChannelTypeEnum.TWITTER,   color: "#000000", className: "left-[2%]  top-[8%]"  },
  { type: ChannelTypeEnum.LINKEDIN,  color: "#2867b2", className: "left-[6%]  top-[32%]" },
  { type: ChannelTypeEnum.YOUTUBE,   color: "#FF0000", className: "left-[2%]  top-[56%]" },
  { type: ChannelTypeEnum.BLUESKY,   color: "#1285fe", className: "right-[2%] top-[8%]"  },
  { type: ChannelTypeEnum.INSTAGRAM, color: "#E4405F", className: "right-[6%] top-[32%]" },
  { type: ChannelTypeEnum.THREADS,   color: "#000000", className: "right-[2%] top-[56%]" },
  { type: ChannelTypeEnum.FACEBOOK,  color: "#1877F2", className: "right-[9%] top-[56%]" },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative overflow-hidden">
      {/* Mobile background: Lightfall */}
      <div className="absolute inset-0 md:hidden">
        <Lightfall mouseInteraction={false} speed={0.4} streakCount={3} opacity={0.85} />
      </div>

      {/* Desktop background: Threads */}
      <div className="absolute inset-0 hidden md:block">
        <Threads amplitude={1} distance={0} enableMouseInteraction />
      </div>

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(248,250,252,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(248,250,252,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      {/* Edge fades so plasma blends into background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl flex-col px-6 pb-16 pt-16">
        {/* Floating platform badges */}
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          {platformBadges.map((platform, index) => {
            const icon = getChannelIcon(platform.type);
            return (
              <motion.div
                key={platform.type}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 0.7, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                className={`absolute ${platform.className} rounded-2xl border border-border/60 bg-card p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.24)]`}
              >
                {icon && (
                  <div
                    className="flex size-9 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    <HugeiconsIcon icon={icon} color="currentColor" className="size-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Centre content */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center text-center"
        >
          <motion.div
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/90 px-4 py-1 text-sm text-muted-foreground shadow-sm"
          >
            <Check className="h-4 w-4 text-primary" />
            <span className="text-xs">Plan ideas, customize by channel, and publish with AI</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="max-w-4xl text-5xl font-semibold tracking-tight text-black dark:text-white sm:text-6xl md:text-7xl"
          >
            Your social media workspace
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Draft faster, stay organized, and schedule content across every channel without the usual mess.
          </motion.p>

          {!isSignedIn ? (
            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <Button asChild className="h-12 rounded-full px-6 text-base">
                <Link href="/sign-up">
                  Get started for free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full px-6 text-base">
                <Link href="/sign-in">Log in</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <Button asChild className="h-12 rounded-full px-6 text-base">
                <Link href="/schedule">
                  Open workspace
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full px-6 text-base">
                <Link href="/ideas">View ideas</Link>
              </Button>
            </motion.div>
          )}

          <motion.p variants={item} className="mt-5 text-sm text-muted-foreground">
            Build drafts once, adapt them per platform, and keep your schedule under control.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
