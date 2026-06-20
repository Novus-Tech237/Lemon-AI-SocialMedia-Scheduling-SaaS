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
    title: "Customize once, publish everywhere",
    description:
      "Start with a global draft, fine-tune each channel, and keep every post matched to the platform.",
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
      className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 md:grid-cols-2"
    >
      {featurePanels.map((feature) => (
        <motion.div
          key={feature.title}
          variants={panel}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
