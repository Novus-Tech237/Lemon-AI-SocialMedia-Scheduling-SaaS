"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    description: "For creators getting started with scheduling.",
    features: [
      "2 connected social accounts",
      "10 scheduled posts / month",
      "Basic AI drafting",
      "Single workspace",
    ],
    cta: "Get started",
    href: "/sign-up",
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    description: "For growing creators who post across platforms.",
    features: [
      "8+ connected social accounts",
      "Unlimited scheduled posts",
      "Advanced AI drafting & rewrites",
      "Per-platform customization",
      "Analytics dashboard",
    ],
    cta: "Start free trial",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    cadence: "/month",
    description: "For teams managing multiple brands.",
    features: [
      "Everything in Pro",
      "Multiple workspaces",
      "Team roles & permissions",
      "Priority support",
    ],
    cta: "Contact sales",
    href: "/sign-up",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 pb-16 scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Start free and upgrade as your audience grows. No hidden fees.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-12 grid gap-5 md:grid-cols-3"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={card}
            whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
            className={`flex flex-col rounded-[28px] border p-8 ${
              plan.highlighted
                ? "border-primary bg-card shadow-[0_20px_40px_rgba(15,23,42,0.10)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.30)]"
                : "border-border/60 bg-card/85"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">{plan.cadence}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {plan.description}
            </p>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={plan.highlighted ? "default" : "outline"}
              className="mt-8 w-full rounded-full"
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Non-Recurring • Cancel anytime • VAT included • Charged per Month
      </p>
    </section>
  );
}
