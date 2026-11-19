import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Mail,
  Building2,
  BookOpen,
  BarChart3,
  CreditCard,
  Zap,
  FileText,
  Scale,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FOREST = "#1F2E26";
const FOREST_60 = "#2D3F33";
const FOREST_40 = "#6B8F78";
const FOREST_5 = "#D4E0D0";
const SURFACE = "#FAFAF7";
const YELLOW = "#FEF8C5";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: "easeOut" },
};

function NumChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
      style={{ background: FOREST_60, color: YELLOW }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-[0.2em]"
      style={{ color: FOREST_40 }}
    >
      {children}
    </span>
  );
}

function Chip({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "yellow";
}) {
  const yellow = variant === "yellow";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
      style={{
        background: yellow ? YELLOW : "#FFFFFF",
        border: `1px solid ${yellow ? YELLOW : FOREST_5}`,
        color: FOREST,
      }}
    >
      {children}
    </span>
  );
}

const addOns = [
  {
    icon: Mail,
    title: "Registered agent",
    desc: "Year-round legal address for state notices. Required by every state.",
    price: "$99 /yr",
  },
  {
    icon: Building2,
    title: "US virtual address",
    desc: "A real street address. Mail scanned to your inbox, physical forwarding to India when you need it.",
    price: "$29 /mo",
  },
  {
    icon: BookOpen,
    title: "Bookkeeping",
    desc: "Monthly books, matched to your bank. P&L and balance sheet, ready for tax season.",
    price: "$99 /mo",
  },
  {
    icon: BarChart3,
    title: "Accounting & tax",
    desc: "Federal and state returns, 1120 or 1065, by a US CPA. Delaware franchise report included.",
    price: "$499 /yr",
  },
  {
    icon: CreditCard,
    title: "Mercury / Brex account",
    desc: "Opened remotely from India. No US travel. Debit card shipped to your address.",
    price: "Included",
  },
  {
    icon: Zap,
    title: "Stripe onboarding",
    desc: "Take US payments on day one. We set up Stripe or an Atlas-equivalent.",
    price: "Included",
  },
  {
    icon: FileText,
    title: "ITIN application",
    desc: "Individual US tax ID for non-resident founders. Handled end-to-end.",
    price: "$249",
  },
  {
    icon: Scale,
    title: "Compliance & filings",
    desc: "BOI, annual report, franchise tax, foreign qualification — filed on time, every year.",
    price: "$149 /yr",
  },
];

const faqs = [
  {
    q: "Do I need to fly to the US?",
    a: "No. You can start, bank and operate a US company without ever setting foot in America. Mercury and Brex onboard remotely. Stripe accepts US LLCs and C-corps formed by non-residents.",
  },
  {
    q: "Which is cheaper, Wyoming or New Mexico?",
    a: "New Mexico is cheaper in the long run — $50 one-time state fee and no annual report, ever. Wyoming is $100 upfront and $60 per year, but with slightly stronger case law for asset protection. For a lean, India-based solo founder, New Mexico wins on cost.",
  },
  {
    q: "Why would I pick Delaware over Wyoming?",
    a: "Pick Delaware when you plan to raise from US venture capital or apply to YC, Techstars or any US accelerator — they want a Delaware C-corp. Otherwise, Wyoming or New Mexico is cheaper and simpler.",
  },
  {
    q: "Will I need to pay US tax?",
    a: "If your LLC has no US-sourced income, no US employees, and no US office, you typically owe no US federal income tax — but you do file Form 5472 and a pro-forma 1120 every year. We handle that. A C-corp owes 21% federal tax on US-sourced profit.",
  },
  {
    q: "Can I use this for Stripe?",
    a: "Yes — that's the most common reason Indian founders set this up. Any of the three structures works.",
  },
  {
    q: "How soon until I have an EIN?",
    a: "Typically 7-14 business days after your company is filed. We submit the SS-4 by fax the day your Articles are accepted, and follow up with the IRS.",
  },
  {
    q: "What about my Indian company — do I need to shut it down?",
    a: "No. Most of our clients run both — the US entity invoices US customers, and the Indian entity handles Indian operations. We can help structure the inter-company agreement under the Liberalised Remittance Scheme (LRS) or ODI route.",
  },
];

export default function UsaIncorporation() {
  const [state, setState] = useState<"wyoming" | "new-mexico" | "delaware">(
    "wyoming"
  );

  useEffect(() => {
    document.title = "Start your US Company from anywhere | FlashSpace";
  }, []);

  const headline =
    state === "wyoming"
      ? "An LLC in Wyoming"
      : state === "new-mexico"
      ? "An LLC in New Mexico"
      : "A Delaware C-corp";

  const sub =
    state === "wyoming"
      ? "Lowest state fees, no franchise tax, strong asset protection. Great fit for freelancers and agencies serving US clients — keep more of what you earn."
      : state === "new-mexico"
      ? "The cheapest LLC in the US. $50 state fee, zero annual report, zero annual fee. Perfect for solo founders in India testing an idea without a yearly bill to worry about."
      : "The standard for raising from US funds, YC and Techstars. Priced rounds, SAFEs and stock options all work out of the box.";

  const price =
    state === "wyoming" ? "$299" : state === "new-mexico" ? "$249" : "$499";

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Header forceWhiteBackground />

      <main className="pt-20 md:pt-24">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
              style={{ background: `${FOREST_5}80` }}
            />
            <div
              className="absolute -bottom-24 left-10 h-[320px] w-[320px] rounded-full blur-3xl"
              style={{ background: `${YELLOW}80` }}
            />
          </div>
          <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-14 md:pt-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
              <motion.div {...fadeUp}>
                <div className="mb-5">
                  <Chip>FlashSpace &middot; US company formation</Chip>
                </div>
                <h1
                  className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight md:text-6xl"
                  style={{
                    color: FOREST,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Start your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">US company</span>
                    <span
                      className="absolute left-0 bottom-1 -z-0 h-3 w-full rounded-sm"
                      style={{ background: YELLOW }}
                    />
                  </span>
                  <br />
                  from anywhere.
                </h1>
                <p
                  className="mt-5 max-w-xl text-lg"
                  style={{ color: FOREST_60 }}
                >
                  A Delaware C-corp, a Wyoming LLC, or a New Mexico LLC —
                  filed, set up with an EIN, and ready to accept Stripe, in
                  days. You sign once. We run the paperwork.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    onClick={() => (window.location.href = "/start-chatting")}
                    className="rounded-full px-6 py-6 text-sm font-semibold"
                    style={{ background: FOREST_60, color: YELLOW }}
                  >
                    Start my US company <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/start-chatting")}
                    className="rounded-full border px-6 py-6 text-sm font-semibold"
                    style={{ borderColor: FOREST_5, color: FOREST }}
                  >
                    Ask Flash AI
                  </Button>
                </div>
                <div
                  className="mt-8 flex flex-wrap items-center gap-6 text-xs"
                  style={{ color: FOREST_40 }}
                >
                  {[
                    "Registered agent included",
                    "EIN typically in 7-14 days",
                    "100% remote, from India",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: FOREST }}
                      />
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="rounded-3xl border bg-white p-6 shadow-sm md:p-7"
                style={{ borderColor: FOREST_5 }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <SectionLabel>Company formation 2026</SectionLabel>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: YELLOW, color: FOREST }}
                  >
                    Live
                  </span>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    {
                      t: "Your Company filed with the state",
                      s: "Delaware, Wyoming, New Mexico, or your pick.",
                    },
                    {
                      t: "EIN from the IRS",
                      s: "Delivered to your inbox, SSN not required.",
                    },
                    {
                      t: "US business bank account",
                      s: "Mercury or Brex, opened remotely from India.",
                    },
                    {
                      t: "Stripe & Operating agreement",
                      s: "Ready to invoice and take US payments.",
                    },
                  ].map((row, i) => (
                    <li key={row.t} className="flex items-start gap-3">
                      <NumChip>{i + 1}</NumChip>
                      <div>
                        <div
                          className="font-semibold"
                          style={{ color: FOREST }}
                        >
                          {row.t}
                        </div>
                        <div style={{ color: FOREST_40 }}>{row.s}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-5 flex items-center justify-between border-t pt-5"
                  style={{ borderColor: FOREST_5 }}
                >
                  <div className="text-xs" style={{ color: FOREST_40 }}>
                    Starts at
                  </div>
                  <div
                    className="text-2xl font-extrabold"
                    style={{
                      color: FOREST,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    $299{" "}
                    <span
                      className="text-sm font-semibold"
                      style={{ color: FOREST_40 }}
                    >
                      + state fee
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* BUILDER */}
        <section
          className="border-y"
          style={{ background: SURFACE, borderColor: FOREST_5 }}
        >
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <motion.div
              {...fadeUp}
              className="mb-10 flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <SectionLabel>The flow</SectionLabel>
                <h2
                  className="mt-2 text-3xl font-extrabold md:text-4xl"
                  style={{
                    color: FOREST,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Build your company
                  <br />
                  in three steps.
                </h2>
              </div>
              <p className="max-w-md" style={{ color: FOREST_60 }}>
                Choose the kind of business. See what we suggest and why. Add
                what you need. The rest of the right updates as you go.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-[1.1fr_1.6fr]">
              {/* LEFT STEPS */}
              <div className="space-y-4">
                <div
                  className="rounded-3xl border bg-white p-5"
                  style={{ borderColor: FOREST_5 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <NumChip>1</NumChip>
                    <span
                      className="font-semibold"
                      style={{ color: FOREST }}
                    >
                      What you're looking to do
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {[
                      { t: "Selling SaaS", s: "to US customers" },
                      {
                        t: "Freelancing / agency",
                        s: "serving US clients",
                        active: true,
                      },
                      { t: "E-commerce", s: "Amazon, Shopify" },
                      { t: "Raising capital", s: "YC-ready structure" },
                    ].map((c) => (
                      <div
                        key={c.t}
                        className="rounded-xl p-3"
                        style={{
                          background: SURFACE,
                          border: `${c.active ? "2px" : "1px"} solid ${
                            c.active ? FOREST : FOREST_5
                          }`,
                        }}
                      >
                        <div
                          className="text-xs font-semibold"
                          style={{ color: FOREST }}
                        >
                          {c.t}
                        </div>
                        <div
                          className="mt-0.5 text-xs"
                          style={{ color: FOREST_40 }}
                        >
                          {c.s}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-3xl border bg-white p-5"
                  style={{ borderColor: FOREST_5 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <NumChip>2</NumChip>
                    <span
                      className="font-semibold"
                      style={{ color: FOREST }}
                    >
                      Where you live
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: YELLOW, color: FOREST }}
                    >
                      🇮🇳 India
                    </span>
                    <Chip>Elsewhere</Chip>
                  </div>
                  <p
                    className="mt-3 text-xs"
                    style={{ color: FOREST_40 }}
                  >
                    We tune the suggestion for founders filing from India — no
                    SSN, ITIN-friendly, bank-ready.
                  </p>
                </div>

                <div
                  className="rounded-3xl border bg-white p-5"
                  style={{ borderColor: FOREST_5 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <NumChip>3</NumChip>
                    <span
                      className="font-semibold"
                      style={{ color: FOREST }}
                    >
                      Timeline
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip>7-10 days</Chip>
                    <Chip variant="yellow">10-14 days (standard)</Chip>
                    <Chip>3-4 weeks</Chip>
                  </div>
                </div>
              </div>

              {/* RIGHT SUGGESTION */}
              <motion.div
                {...fadeUp}
                className="relative rounded-3xl border bg-white p-6"
                style={{ borderColor: FOREST_5 }}
              >
                <span
                  className="absolute -top-3 left-6 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ background: YELLOW, color: FOREST }}
                >
                  Our suggestion
                </span>
                <div className="mb-4 mt-3 flex items-center justify-between">
                  <h3
                    className="text-2xl font-extrabold"
                    style={{
                      color: FOREST,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {headline}
                  </h3>
                  <span
                    className="text-xl font-extrabold"
                    style={{
                      color: FOREST,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {price}
                  </span>
                </div>
                <p className="text-sm" style={{ color: FOREST_60 }}>
                  {sub}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  {(state === "wyoming"
                    ? [
                        ["State fee", "$100 one-time"],
                        ["Annual renewal", "$60 /yr"],
                        ["Franchise tax", "None"],
                        ["Processing", "10-14 days"],
                      ]
                    : state === "new-mexico"
                    ? [
                        ["State fee", "$50 one-time"],
                        ["Annual renewal", "$0"],
                        ["Annual report", "None"],
                        ["Processing", "7-10 days"],
                      ]
                    : [
                        ["State fee", "$89 one-time"],
                        ["Franchise tax", "$400+ /yr"],
                        ["Annual report", "Required"],
                        ["Processing", "7-10 days"],
                      ]
                  ).map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-xl p-3"
                      style={{ background: SURFACE }}
                    >
                      <div style={{ color: FOREST_40 }}>{k}</div>
                      <div
                        className="mt-1 font-semibold"
                        style={{ color: FOREST }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alt pick — New Mexico (price-conscious) */}
                {state !== "new-mexico" && (
                  <div
                    className="mt-5 border-t pt-5"
                    style={{ borderColor: FOREST_5 }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip variant="yellow">Price-conscious pick</Chip>
                        <h4
                          className="ml-1 text-lg font-extrabold"
                          style={{
                            color: FOREST,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          Or — An LLC in New Mexico
                        </h4>
                      </div>
                      <span
                        className="text-lg font-extrabold"
                        style={{
                          color: FOREST,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        $249
                      </span>
                    </div>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: FOREST_60 }}
                    >
                      The cheapest LLC in the US. $50 state fee,{" "}
                      <span
                        className="font-semibold"
                        style={{ color: FOREST }}
                      >
                        zero annual report
                      </span>
                      , zero annual fee. Perfect for solo founders in India
                      testing an idea without a yearly bill to worry about.
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                      {[
                        ["State fee", "$50"],
                        ["Annual", "$0"],
                        ["Report", "None"],
                        ["Privacy", "Strong"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="rounded-xl p-2 text-center"
                          style={{ background: SURFACE }}
                        >
                          <div style={{ color: FOREST_40 }}>{k}</div>
                          <div
                            className="font-semibold"
                            style={{ color: FOREST }}
                          >
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => (window.location.href = "/start-chatting")}
                    className="rounded-full text-sm font-semibold"
                    style={{ background: FOREST_60, color: YELLOW }}
                  >
                    Start with {state === "new-mexico" ? "New Mexico" : state === "wyoming" ? "Wyoming" : "Delaware"}{" "}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                  <div className="flex flex-wrap gap-2">
                    {state !== "wyoming" && (
                      <Button
                        variant="outline"
                        onClick={() => setState("wyoming")}
                        className="rounded-full border text-sm font-semibold"
                        style={{ borderColor: FOREST_5, color: FOREST }}
                      >
                        Switch to Wyoming
                      </Button>
                    )}
                    {state !== "new-mexico" && (
                      <Button
                        variant="outline"
                        onClick={() => setState("new-mexico")}
                        className="rounded-full border text-sm font-semibold"
                        style={{ borderColor: FOREST_5, color: FOREST }}
                      >
                        Switch to New Mexico
                      </Button>
                    )}
                    {state !== "delaware" && (
                      <Button
                        variant="outline"
                        onClick={() => setState("delaware")}
                        className="rounded-full border text-sm font-semibold"
                        style={{ borderColor: FOREST_5, color: FOREST }}
                      >
                        Switch to Delaware
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* LLC VS C-CORP */}
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <motion.div {...fadeUp}>
              <SectionLabel>LLC vs C-Corp</SectionLabel>
              <h2
                className="mb-10 mt-2 text-3xl font-extrabold md:text-4xl"
                style={{
                  color: FOREST,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                The two structures,
                <br />
                in plain words.
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  name: "LLC",
                  badge: "Most founders start here",
                  rows: [
                    ["Best for", "Freelancers, agencies, consultants, small SaaS"],
                    ["Taxation", "Pass-through — no corporate tax, you file personally"],
                    ["Raises capital", "Hard. VCs and YC want a C-corp."],
                    ["Admin", "Light — annual renewal, no board, no stock"],
                    ["Starting at", "$249 + state fee"],
                  ],
                  featured: false,
                },
                {
                  name: "C-corp",
                  badge: "YC-ready",
                  rows: [
                    ["Best for", "Startups raising from US funds or joining accelerators"],
                    ["Taxation", "Corporate tax 21% + personal on dividends"],
                    ["Raises capital", "Easy — SAFEs, priced rounds, stock options"],
                    ["Admin", "Board, bylaws, stock ledger, 83(b), Delaware franchise"],
                    ["Starting at", "$499 + state fee"],
                  ],
                  featured: true,
                },
              ].map((c) => (
                <motion.div
                  key={c.name}
                  {...fadeUp}
                  className="rounded-3xl bg-white p-7"
                  style={{
                    border: `${c.featured ? "2px" : "1px"} solid ${
                      c.featured ? FOREST : FOREST_5
                    }`,
                  }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h3
                      className="text-2xl font-extrabold"
                      style={{
                        color: FOREST,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {c.name}
                    </h3>
                    {c.featured ? (
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                        style={{ background: YELLOW, color: FOREST }}
                      >
                        {c.badge}
                      </span>
                    ) : (
                      <Chip variant="yellow">{c.badge}</Chip>
                    )}
                  </div>
                  <div className="divide-y" style={{ borderColor: FOREST_5 }}>
                    {c.rows.map(([k, v], i) => (
                      <div
                        key={k}
                        className="py-3.5"
                        style={{
                          borderTop:
                            i === 0 ? "none" : `1px solid ${FOREST_5}`,
                        }}
                      >
                        <div
                          className="text-[11px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: FOREST_40 }}
                        >
                          {k}
                        </div>
                        <div
                          className={`mt-1 text-sm ${
                            k === "Starting at"
                              ? "text-xl font-extrabold"
                              : ""
                          }`}
                          style={{
                            color: FOREST,
                            fontFamily:
                              k === "Starting at"
                                ? "'Plus Jakarta Sans', sans-serif"
                                : undefined,
                          }}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING TABLE */}
        <section
          className="border-y"
          style={{ background: SURFACE, borderColor: FOREST_5 }}
        >
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <motion.div {...fadeUp} className="mb-10">
              <SectionLabel>Every price, line by line</SectionLabel>
              <h2
                className="mt-2 text-3xl font-extrabold md:text-4xl"
                style={{
                  color: FOREST,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                One price. One state fee.
                <br />
                Then only what we choose.
              </h2>
            </motion.div>

            <div
              className="overflow-hidden rounded-3xl border bg-white"
              style={{ borderColor: FOREST_5 }}
            >
              <div
                className="grid grid-cols-[1.4fr_repeat(3,1fr)] px-4 py-4 text-sm md:px-6"
                style={{ background: FOREST, color: "#FFFFFF" }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: YELLOW }}
                >
                  Company formation 2026
                </div>
                <div className="text-center font-semibold">New Mexico LLC</div>
                <div className="text-center font-semibold">Wyoming LLC</div>
                <div className="text-center font-semibold">Delaware C-Corp</div>
              </div>
              <div className="text-sm">
                {[
                  ["Flashspace service fee", "$249", "$299", "$499", true],
                  ["State filing fee", "$50", "$100", "$89"],
                  ["Registered agent (yr 1)", "Included", "Included", "Included"],
                  ["EIN from IRS", "Included", "Included", "Included"],
                  ["US bank account help", "Included", "Included", "Included"],
                  ["Operating agreement / bylaws", "Included", "Included", "Included"],
                  ["Stripe / Mercury onboarding", "Included", "Included", "Included"],
                  ["All-in year 1", "$299", "$399", "$588", false, true],
                  ["Year 2 renewal (agent + state)", "$119", "$179", "$225 + franchise"],
                ].map(([k, a, b, c, bold, highlight], i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.4fr_repeat(3,1fr)] px-4 py-3 md:px-6"
                    style={{
                      background: highlight
                        ? `${YELLOW}66`
                        : i % 2 === 1
                        ? SURFACE
                        : "#FFFFFF",
                      borderTop: i === 0 ? "none" : `1px solid ${FOREST_5}`,
                    }}
                  >
                    <div
                      className={highlight ? "font-semibold" : ""}
                      style={{ color: highlight ? FOREST : FOREST_60 }}
                    >
                      {k as string}
                    </div>
                    {[a, b, c].map((v, j) => (
                      <div
                        key={j}
                        className={`text-center ${
                          bold || highlight ? "font-extrabold" : ""
                        }`}
                        style={{
                          color: FOREST,
                          fontFamily:
                            bold || highlight
                              ? "'Plus Jakarta Sans', sans-serif"
                              : undefined,
                        }}
                      >
                        {v as string}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p
              className="mt-3 text-xs"
              style={{ color: FOREST_40 }}
            >
              State fees shown are the official 2026 filing fees. We don't mark
              them up. Every optional service below is à la carte — add it when
              you need it.
            </p>
          </div>
        </section>

        {/* ADD-ONS */}
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <motion.div
              {...fadeUp}
              className="mb-10 flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <SectionLabel>What else you might want</SectionLabel>
                <h2
                  className="mt-2 text-3xl font-extrabold md:text-4xl"
                  style={{
                    color: FOREST,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  The things
                  <br />a US company needs next.
                </h2>
              </div>
              <p className="max-w-sm" style={{ color: FOREST_60 }}>
                Pick what you need. Each one plugs into your company without
                starting over.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {addOns.map((a) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={a.title}
                    {...fadeUp}
                    className="rounded-3xl border bg-white p-5"
                    style={{ borderColor: FOREST_5 }}
                  >
                    <Icon
                      className="mb-3 h-6 w-6"
                      style={{ color: FOREST }}
                    />
                    <h3
                      className="text-lg font-extrabold"
                      style={{
                        color: FOREST,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {a.title}
                    </h3>
                    <p
                      className="mt-1.5 text-sm"
                      style={{ color: FOREST_60 }}
                    >
                      {a.desc}
                    </p>
                    <div
                      className="mt-4 flex items-center justify-between border-t pt-4"
                      style={{ borderColor: FOREST_5 }}
                    >
                      <span className="text-xs" style={{ color: FOREST_40 }}>
                        from
                      </span>
                      <span
                        className="font-extrabold"
                        style={{
                          color: FOREST,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {a.price}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DARK CTA BAND */}
        <section style={{ background: FOREST }}>
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
              <motion.div {...fadeUp}>
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: YELLOW }}
                >
                  Hand it to an agent
                </span>
                <h2
                  className="mt-2 text-3xl font-extrabold text-white md:text-4xl"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Let an agent run it.
                  <br />A person signs it off.
                </h2>
                <p className="mt-4 max-w-md text-white/80">
                  Flashspace's Flash AI does the research, the filing
                  paperwork and the EIN application. One of our India-based
                  company specialists reviews, signs the engagement, and ships
                  it. You get one point of contact in your own time zone.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => (window.location.href = "/start-chatting")}
                    className="rounded-full px-5 py-5 text-sm font-semibold"
                    style={{ background: YELLOW, color: FOREST }}
                  >
                    Start with Flash AI <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/start-chatting")}
                    className="rounded-full border border-white/30 bg-transparent px-5 py-5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Talk to a specialist
                  </Button>
                </div>
              </motion.div>
              <motion.pre
                {...fadeUp}
                className="overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-relaxed text-white/80"
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >{`> flashspace us-incorp  --state wyoming --kind llc
✓ Articles of Organization filed      10 min
✓ Registered agent assigned           instant
✓ Operating agreement drafted         1 hr
✓ EIN SS-4 submitted to IRS           1 day
✓ Mercury application queued          pending bank
✓ Stripe onboarding prepared          queued

# Specialist review
Flashspace team  signing in 1 business day.`}</motion.pre>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
              <motion.div {...fadeUp}>
                <SectionLabel>USA, answered plainly</SectionLabel>
                <h2
                  className="mt-2 text-3xl font-extrabold md:text-4xl"
                  style={{
                    color: FOREST,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Questions,
                  <br />
                  answered plainly.
                </h2>
                <p
                  className="mt-4 text-sm"
                  style={{ color: FOREST_60 }}
                >
                  The ones we get most from Indian founders. If one of yours
                  isn't here, ask Flash AI — it'll know.
                </p>
              </motion.div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`q-${i}`}
                    className="rounded-3xl border bg-white px-5"
                    style={{ borderColor: FOREST_5 }}
                  >
                    <AccordionTrigger
                      className="py-5 text-left font-semibold hover:no-underline"
                      style={{ color: FOREST }}
                    >
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent
                      className="pb-5 text-sm"
                      style={{ color: FOREST_60 }}
                    >
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* BOTTOM FORM BAND */}
        <section style={{ background: FOREST }}>
          <div className="mx-auto max-w-[1200px] px-6 py-14">
            <div
              className="rounded-3xl border border-white/10 p-6 md:p-8"
              style={{ background: FOREST_60 }}
            >
              <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1.5fr]">
                <div>
                  <h3
                    className="text-2xl font-extrabold text-white md:text-3xl"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Tell us about
                    <br />
                    your business.
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    One question is enough. We'll suggest the structure, the
                    state and the next step.
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = "/start-chatting";
                  }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="e.g. I run a 3-person agency in Pune serving US SaaS clients"
                  />
                  <Button
                    type="submit"
                    className="whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold"
                    style={{ background: YELLOW, color: FOREST }}
                  >
                    Ask Flash AI <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
