"use client";

import { motion, type Variants } from "motion/react";

const stats = [
  { value: "8",  label: "social platforms supported" },
  { value: "1",  label: "workspace for planning and scheduling" },
  { value: "AI", label: "built into drafting and publishing" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-4 md:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={card}
            className="rounded-[28px] border border-border/60 bg-card/85 px-6 py-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          >
            <div className="text-4xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </div>
            <div className="mt-3 text-sm uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
