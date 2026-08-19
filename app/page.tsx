"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  X,
} from "lucide-react";

const navLinks = ["Features", "How it works", "Plans", "Contact"];

const features = [
  {
    title: "Real-Time Visibility",
    description:
      "Never wonder where the van is again. Track live routes and receive instant notifications for arrivals and pickups.",
    icon: MapPin,
  },
  {
    title: "Easy Payments",
    description:
      "Automate your monthly subscriptions. Manage payments securely via JazzCash and other digital wallets.",
    icon: CreditCard,
  },
  {
    title: "Smart Alerts",
    description:
      "Get instant updates on schedule changes, delays, or emergency alerts sent directly to your phone.",
    icon: Bell,
  },
];

const steps = [
  {
    title: "Sign Up",
    description: "Create your profile and secure your account.",
    icon: Users,
  },
  {
    title: "Add Details",
    description: "Enter child info and preferred route points.",
    icon: CalendarDays,
  },
  {
    title: "Subscribe",
    description: "Select a plan and pay via JazzCash.",
    icon: CreditCard,
  },
  {
    title: "Track & Ride",
    description: "Receive live alerts for every safe journey.",
    icon: Truck,
  },
];

const plans = [
  {
    name: "Basic",
    price: "PKR 3,000/mo",
    note: "1 Child Enrollment",
    items: ["1 Child Enrollment", "Daily Status Updates", "SMS Alerts"],
    featured: false,
  },
  {
    name: "Standard",
    price: "PKR 5,000/mo",
    note: "2 Children Enrollment",
    items: ["2 Children Enrollment", "Real-time App Tracking", "Priority Route Selection", "Detailed Route Analytics"],
    featured: true,
  },
  {
    name: "Premium",
    price: "PKR 7,500/mo",
    note: "Up to 4 Children",
    items: ["Up to 4 Children", "Dedicated Account Manager", "Home Pick-up Guarantee", "Insurance Coverage"],
    featured: false,
  },
  {
    name: "Free Trial",
    price: "PKR 0/mo",
    note: "7 Day Free Trial",
    items: ["1 Child Enrollment", "Basic App Tracking", "Email Support"],
    featured: false,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            VanGo <span className="font-bold text-primary">Plus</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-muted transition hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-card)] transition hover:bg-[#2563a0]"
            >
              Get Started
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-border bg-surface p-2 text-foreground shadow-[var(--shadow-card)] transition hover:bg-surface-container-low md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <ArrowRight className="h-5 w-5 rotate-90" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-900/5 md:hidden">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/login" className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl space-y-8">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-900 ring-1 ring-sky-200">
              Trusted by 500+ Schools
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Safe school transport, managed in one place
              </h1>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                VanGo Plus helps parents track rides, manage subscriptions, and keep kids safe with real-time intelligence.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                Create Parent Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                See Demo
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface px-5 py-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 text-foreground">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Truck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">ETA</p>
                    <p className="text-lg font-semibold text-foreground">5 mins</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface px-5 py-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 text-foreground">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-container-low text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Driver</p>
                    <p className="text-lg font-semibold text-foreground">Ahmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex max-w-xl items-center justify-center">
            <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-sky-100/80 blur-3xl" />
            <div className="relative w-full overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="absolute right-6 top-6 rounded-3xl bg-primary text-white px-4 py-3 text-sm shadow-lg shadow-primary/20">
                <p className="font-semibold">Current Status</p>
                <p className="text-primary/80">On Route to Home</p>
              </div>
              <div className="space-y-6">
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Route</p>
                      <p className="text-xl font-semibold text-slate-950">C-12 Downtown</p>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      Live
                    </div>
                  </div>
                  <div className="mt-4 rounded-3xl bg-gradient-to-br from-sky-700 to-slate-900 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-200">ETA at pickup</p>
                        <p className="text-2xl font-semibold">07:15 AM</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 px-3 py-1 text-xs">On Track</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-900">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm text-slate-500">Students on board</p>
                        <p className="text-xl font-semibold text-slate-950">24/26</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm text-slate-500">Next stop</p>
                        <p className="text-xl font-semibold text-slate-950">School Gate</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-900 p-4 text-slate-100 shadow-inner">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Route map</span>
                    <span>15 min</span>
                  </div>
                  <div className="mt-4 h-52 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_32%),linear-gradient(180deg,#0f172a_0%,#0f172a_100%)] p-4">
                    <div className="relative h-full rounded-[1.25rem] border border-slate-700 bg-slate-950/70 p-4">
                      <div className="h-full w-full rounded-[1rem] bg-[linear-gradient(135deg,_rgba(56,189,248,0.15),_rgba(56,189,248,0.02))] p-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-sky-300">A</span>
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">On time</span>
                        </div>
                        <div className="mt-6 space-y-3 text-xs text-slate-300">
                          <p>Pickup: 07:15 AM</p>
                          <p>Drop-off: 08:20 AM</p>
                        </div>
                        <div className="absolute bottom-6 left-4 flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3 py-2 text-xs text-slate-200 shadow-lg shadow-slate-950/20">
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          Live route tracking
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Built for Peace of Mind</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            We've reimagined school transportation from the ground up.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            Prioritizing safety, transparency, and simplicity for modern families and fleet operators.
          </p>
        </div>
        <div className="mx-auto mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-[2rem] border border-border bg-surface p-8 shadow-[var(--shadow-card)]"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">For Parents</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Manage your child's day
              </h3>
            </div>
            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">My Children</p>
                    <p className="mt-2 text-sm text-slate-500">2 children enrolled</p>
                  </div>
                  <div className="inline-flex items-center rounded-2xl bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    2x
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AA</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">Ayaan Ali</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">SM</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">Sara Malik</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">Alerts</p>
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">2 New</span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Van delayed by 7 mins</p>
                    <p>Student dropped off</p>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">Transport Schedule</p>
                    <span className="text-xs text-slate-500">Today</span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm text-slate-500">Pick-up</p>
                      <p className="text-lg font-semibold text-slate-950">07:15 AM</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm text-slate-500">Drop-off</p>
                      <p className="text-lg font-semibold text-slate-950">02:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Live Attendance</p>
                <p className="mt-3 text-3xl font-semibold">Full fleet control</p>
              </div>
              <span className="rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Real time
              </span>
            </div>
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20">
              <div className="space-y-4">
                {[
                  "Route A-12 (Downtown) — 24/24 Students",
                  "Route B-04 (Northview) — 18/22 Students",
                  "Route C-07 (Riverside) — 20/20 Students",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-300">{item}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">On time</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-center">
                  <p className="text-5xl font-semibold text-sky-400">42</p>
                  <p className="mt-2 text-sm text-slate-400">Active Drivers</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-center">
                  <p className="text-5xl font-semibold text-emerald-400">12</p>
                  <p className="mt-2 text-sm text-slate-400">Daily Routes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Getting started is simple</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A quick onboarding flow to get your family moving.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="group rounded-[2rem] border border-border bg-surface p-6 text-center shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Step {index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="plans" className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Transparent plans for every family</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Flexible subscriptions with easy digital wallet payments.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-[2rem] border bg-surface p-7 shadow-[var(--shadow-card)] transition ${
                plan.featured ? "border-primary shadow-[var(--shadow-card-hover)]" : "border-border"
              }`}
            >
              {plan.featured && (
                <div className="absolute left-0 top-0 h-2 w-full bg-slate-900" />
              )}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{plan.name}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{plan.price}</p>
                </div>
                {plan.featured && (
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-5 text-sm text-slate-500">{plan.note}</p>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <Check className="h-4 w-4" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-primary text-white hover:bg-[#2563a0]"
                    : "border border-primary text-primary bg-transparent hover:bg-primary/5"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-4 py-16 text-muted sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="text-xl font-semibold text-white">VanGo Plus</p>
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Making school transport safer and more manageable for the next generation of students and parents.
            </p>
            <p className="text-sm text-slate-500">© 2026 VanGo Plus. All rights reserved.</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Resources</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Company</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>
                <a href="#" className="transition hover:text-white">
                  Safety Standards
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Developer Portal
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
