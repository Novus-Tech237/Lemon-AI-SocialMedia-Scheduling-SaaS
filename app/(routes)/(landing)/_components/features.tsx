"use client";

import { motion, type Variants } from "motion/react";

const featurePanels = [
  {
    title: "The cleanest way to plan your week",
    description:
      "See your ideas, drafts, and scheduled posts in one place without juggling tabs and spreadsheets.",
    tone: "bg-[#ead6ff] dark:bg-card",
  },
  {
    title: "Post on time, Every time",
    description:
      "Set it and forget it. Automated cron jobs make sure your content goes out exactly when you planned.",
    tone: "bg-[#d7f2b7] dark:bg-card",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const panel: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Features() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      id="features"
      className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 md:grid-cols-2 scroll-mt-24"
    >
      {featurePanels.map((feature) => (
        <motion.div
          key={feature.title}
          variants={panel}
          whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
          className={`${feature.tone} rounded-[28px] border border-border/60 p-8`}
        >
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {feature.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}
