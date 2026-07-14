"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Send,
  Home,
  MapPin,
  Phone,
  Mail,
  Clock,
  IndianRupee,
  CheckCircle2,
  ExternalLink,
  LayoutGrid,
  Headset,
  ArrowLeft,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn, formatINR } from "@/lib/utils";
import {
  services,
  categories,
  groupsInCategory,
  type Service,
  type CategorySlug,
} from "@/lib/services";
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Message = {
  id: number;
  role: "bot" | "user";
  content: React.ReactNode;
  options?: string[];
};

let msgId = 0;
const nextId = () => ++msgId;

/* ------------------------------------------------------------------ */
/* Canonical menu labels — plain text, icons attached at render time   */
/* (SVG icons, not emoji, per brand style: Trust & Authority / fintech) */
/* ------------------------------------------------------------------ */

const MENU = {
  SERVICES: "Our Services",
  PRICING: "Pricing Info",
  OFFICES: "Our Offices",
  CONTACT: "Talk to a Human",
  HOME: "Main Menu",
  BACK: "Back",
} as const;

const MAIN_MENU_OPTIONS = [MENU.SERVICES, MENU.PRICING, MENU.OFFICES, MENU.CONTACT];

const QUICK_ACTION_ICONS: Record<string, LucideIcon> = {
  [MENU.SERVICES]: LayoutGrid,
  [MENU.PRICING]: IndianRupee,
  [MENU.OFFICES]: MapPin,
  [MENU.CONTACT]: Headset,
  [MENU.HOME]: Home,
  [MENU.BACK]: ArrowLeft,
};

function iconForOption(label: string): LucideIcon | null {
  if (QUICK_ACTION_ICONS[label]) return QUICK_ACTION_ICONS[label];
  if (label.startsWith("Back to ")) return ArrowLeft;
  return null;
}

/* ------------------------------------------------------------------ */
/* Keyword → service slug mapping for smart search                     */
/* ------------------------------------------------------------------ */

const keywordMap: Record<string, string[]> = {
  gst: ["gst-registration", "gst-filing", "gst-advisory"],
  llp: ["llp-registration"],
  opc: ["one-person-company"],
  trademark: ["trademark-search", "respond-to-tm-objection"],
  tm: ["trademark-search", "respond-to-tm-objection"],
  patent: ["patent", "patent-search", "provisional-patent-application", "permanent-patent"],
  loan: ["business-loans", "home-loans", "term-loans", "loan-against-property"],
  itr: ["income-tax-filing"],
  "income tax": ["income-tax-filing", "income-tax-notice", "income-tax-assessment"],
  roc: ["roc-annual-filing"],
  fssai: ["fssai-food-license"],
  food: ["fssai-food-license"],
  iso: ["iso-certification"],
  msme: ["msme-udyam-registration"],
  udyam: ["msme-udyam-registration"],
  cibil: ["cibil-score"],
  copyright: ["copyright-registration"],
  ngo: ["trust-registration", "society-registration", "section-8-ngo"],
  trust: ["trust-registration"],
  society: ["society-registration"],
  rental: ["rental-agreement"],
  partnership: ["partnership-firm", "partnership-deed"],
  dsc: ["digital-signature-certificate"],
  digital: ["digital-signature-certificate"],
  rera: ["rera-project-registration", "rera-agent-registration"],
  apeda: ["apeda-certification"],
  import: ["import-export-code"],
  export: ["import-export-code"],
  pitch: ["pitch-deck"],
  fundraising: ["fundraising"],
  cma: ["cma-report"],
};

/* ------------------------------------------------------------------ */
/* Service detail card                                                 */
/* ------------------------------------------------------------------ */

function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[0.8125rem] font-semibold leading-snug">
        {s.name}
      </p>
      <p className="text-xs leading-relaxed text-ink-muted">{s.short}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.6875rem]">
        <span className="inline-flex items-center gap-1 font-medium text-[var(--accent)]">
          <IndianRupee className="size-3" />
          {s.price ? formatINR(s.price) : "Custom quote"}
        </span>
        <span className="inline-flex items-center gap-1 text-ink-muted">
          <Clock className="size-3" />
          {s.timeline}
        </span>
      </div>

      {s.highlights.length > 0 && (
        <ul className="space-y-1 pt-1">
          {s.highlights.slice(0, 3).map((h) => (
            <li
              key={h}
              className="flex items-start gap-1.5 text-[0.6875rem] leading-snug text-ink-muted"
            >
              <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-green-500" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/services/${s.slug}`}
        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
      >
        View full details <ExternalLink className="size-3" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Office card                                                         */
/* ------------------------------------------------------------------ */

function OfficeCards() {
  return (
    <div className="space-y-2.5">
      <p className="text-[0.8125rem] font-medium">Our offices:</p>
      {site.offices.map((o) => (
        <div
          key={o.city}
          className="rounded-xl border border-ink-border bg-ink-raised/50 p-3"
        >
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)]" />
            <div className="space-y-1">
              <p className="text-xs font-semibold">
                {o.city}{" "}
                <span className="font-normal text-ink-muted">· {o.label}</span>
              </p>
              <p className="text-[0.6875rem] leading-relaxed text-ink-muted">
                {o.address}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {o.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1 text-[0.6875rem] text-[var(--accent)] hover:underline"
                  >
                    <Phone className="size-2.5" />
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Response generator                                                  */
/* ------------------------------------------------------------------ */

function generateBotResponse(input: string): {
  content: React.ReactNode;
  options?: string[];
} {
  const lowerInput = input.toLowerCase().trim();

  // ── Main Menu ──
  if (lowerInput === MENU.HOME.toLowerCase()) {
    return {
      content: "Sure — what would you like to explore?",
      options: MAIN_MENU_OPTIONS,
    };
  }

  // ── Greeting ──
  if (/^(hi|hello|hey|greetings|hola|good\s?(morning|evening|afternoon))\b/.test(lowerInput) && lowerInput.length < 25) {
    return {
      content: "Hello, welcome to WealthBridge. I can help you explore our services, check pricing, find our offices, or connect you with an expert.",
      options: MAIN_MENU_OPTIONS,
    };
  }

  // ── Browse Services ──
  if (
    lowerInput === MENU.SERVICES.toLowerCase() ||
    lowerInput === "services" ||
    lowerInput === "all services"
  ) {
    return {
      content: "We offer services across 5 categories. Pick one to explore:",
      options: [...categories.map((c) => c.title), MENU.HOME],
    };
  }

  // ── Category Selected ──
  const matchedCategory = categories.find(
    (c) => lowerInput === c.title.toLowerCase() || lowerInput === `back to ${c.title.toLowerCase()}`
  );
  if (matchedCategory) {
    const groups = groupsInCategory(matchedCategory.slug);
    const serviceOptions: string[] = [];
    const contentParts: React.ReactNode[] = [];

    groups.forEach((g, gi) => {
      contentParts.push(
        <p key={gi} className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-muted first:mt-0">
          {g.group}
        </p>
      );
      g.items.forEach((s) => serviceOptions.push(s.name));
    });

    return {
      content: (
        <div className="space-y-1">
          <p className="text-[0.8125rem] font-medium">{matchedCategory.title}</p>
          <p className="text-xs text-ink-muted">{matchedCategory.tagline}</p>
          {contentParts}
        </div>
      ),
      options: [...serviceOptions, MENU.BACK, MENU.HOME],
    };
  }

  // ── Back (generic) ──
  if (lowerInput === MENU.BACK.toLowerCase()) {
    return {
      content: "Which category would you like to explore?",
      options: [...categories.map((c) => c.title), MENU.HOME],
    };
  }

  // ── About Us ──
  if (
    lowerInput.includes("about") ||
    lowerInput === "who are you" ||
    lowerInput.includes("about wealthbridge") ||
    lowerInput.includes("about wealth bridge") ||
    lowerInput.includes("your company")
  ) {
    return {
      content: (
        <div className="space-y-2">
          <p className="text-[0.8125rem] font-medium">About The Wealth Bridge</p>
          <p className="text-xs leading-relaxed text-ink-muted">
            We&apos;re a one-stop business setup and compliance partner based in Vellore, Tamil Nadu — <strong>serving businesses since 2007</strong>.
          </p>
          <p className="text-xs leading-relaxed text-ink-muted">
            Our team includes Business Analysts, Company Secretaries, Chartered Accountants, Corporate Lawyers, and Financial Professionals — all under one roof.
          </p>
        </div>
      ),
      options: [MENU.OFFICES, MENU.SERVICES, MENU.CONTACT, MENU.HOME],
    };
  }

  // ── Office Locations ──
  if (
    lowerInput === MENU.OFFICES.toLowerCase() ||
    lowerInput.includes("office") ||
    lowerInput.includes("location") ||
    lowerInput.includes("address") ||
    lowerInput.includes("where") ||
    lowerInput.includes("visit")
  ) {
    return {
      content: <OfficeCards />,
      options: [MENU.SERVICES, MENU.CONTACT, MENU.HOME],
    };
  }

  // ── Contact / Talk to Human ──
  if (
    lowerInput === MENU.CONTACT.toLowerCase() ||
    lowerInput.includes("contact") ||
    lowerInput.includes("human") ||
    lowerInput.includes("phone") ||
    lowerInput.includes("call") ||
    lowerInput.includes("support") ||
    lowerInput.includes("speak")
  ) {
    return {
      content: (
        <div className="space-y-2">
          <p className="text-[0.8125rem] font-medium">Get in touch</p>
          <div className="space-y-1.5">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-xs text-[var(--accent)] hover:underline"
            >
              <Phone className="size-3" /> {site.phone}
            </a>
            <a
              href={`tel:${site.phoneAlt.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-xs text-[var(--accent)] hover:underline"
            >
              <Phone className="size-3" /> {site.phoneAlt}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2 text-xs text-[var(--accent)] hover:underline"
            >
              <Mail className="size-3" /> {site.email}
            </a>
          </div>
          <p className="text-[0.6875rem] text-ink-muted">
            Or visit our{" "}
            <Link href="/contact" className="text-[var(--accent)] hover:underline">
              contact page
            </Link>{" "}
            to send us a message.
          </p>
        </div>
      ),
      options: [MENU.OFFICES, MENU.SERVICES, MENU.HOME],
    };
  }

  // ── Service lookup (exact match by name) ──
  const matchedService = services.find(
    (s) =>
      lowerInput === s.name.toLowerCase() ||
      lowerInput === s.slug.replace(/-/g, " ")
  );
  if (matchedService) {
    const cat = categories.find((c) => c.slug === matchedService.category);
    return {
      content: <ServiceCard s={matchedService} />,
      options: [
        ...(cat ? [`Back to ${cat.title}`] : []),
        MENU.CONTACT,
        MENU.HOME,
      ],
    };
  }

  // ── Smart keyword matching ──
  for (const [keyword, slugs] of Object.entries(keywordMap)) {
    if (lowerInput.includes(keyword)) {
      const matched = slugs
        .map((slug) => services.find((s) => s.slug === slug))
        .filter(Boolean) as Service[];
      if (matched.length === 1) {
        return {
          content: <ServiceCard s={matched[0]} />,
          options: [MENU.SERVICES, MENU.CONTACT, MENU.HOME],
        };
      }
      if (matched.length > 1) {
        return {
          content: `I found ${matched.length} services related to "${keyword}". Which one are you looking for?`,
          options: [...matched.map((s) => s.name), MENU.HOME],
        };
      }
    }
  }

  // ── Fuzzy service name match (partial) ──
  const fuzzyMatch = services.find(
    (s) =>
      lowerInput.includes(s.name.toLowerCase()) ||
      (s.slug.replace(/-/g, " ") !== "" &&
        lowerInput.includes(s.slug.replace(/-/g, " ")))
  );
  if (fuzzyMatch) {
    const cat = categories.find((c) => c.slug === fuzzyMatch.category);
    return {
      content: <ServiceCard s={fuzzyMatch} />,
      options: [
        ...(cat ? [`Back to ${cat.title}`] : []),
        MENU.CONTACT,
        MENU.HOME,
      ],
    };
  }

  // ── Pricing intent ──
  if (
    lowerInput.includes("price") ||
    lowerInput.includes("cost") ||
    lowerInput.includes("fee") ||
    lowerInput.includes("how much") ||
    lowerInput.includes("pricing") ||
    lowerInput === MENU.PRICING.toLowerCase()
  ) {
    return {
      content:
        "Our pricing varies by service. Pick a category and I'll show you the details:",
      options: [...categories.map((c) => c.title), MENU.HOME],
    };
  }

  // ── Thank you ──
  if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
    return {
      content: "You're welcome! Is there anything else I can help you with?",
      options: [MENU.SERVICES, MENU.CONTACT, MENU.HOME],
    };
  }

  // ── Fallback ──
  return {
    content:
      "I didn't quite catch that. Pick an option below, or try asking about a specific service — for example \"GST\" or \"company registration\".",
    options: MAIN_MENU_OPTIONS,
  };
}

/* ------------------------------------------------------------------ */
/* Chatbot component                                                   */
/* ------------------------------------------------------------------ */

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasEverOpened, setHasEverOpened] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: nextId(),
      role: "bot",
      content:
        "Hi, I'm the WealthBridge AI Assistant. Ask me about company registration, GST, taxes, loans, or anything else — I'm happy to help.",
      options: MAIN_MENU_OPTIONS,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: text },
    ]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(text);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          content: response.content,
          options: response.options,
        },
      ]);
    }, 800 + Math.random() * 700);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const lastBotMsgId = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "bot") return messages[i].id;
    }
    return -1;
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-label="WealthBridge AI Assistant chat"
            className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[28px] border border-ink-border bg-ink-raised shadow-[0_30px_80px_-24px_rgba(3,20,50,0.55)] backdrop-blur-xl"
          >
            {/* Header */}
            <div
              className="relative overflow-hidden px-4 py-4"
              style={{ background: "var(--gradient-navy)" }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 15% 0%, rgba(255,255,255,0.18), transparent 55%)",
                }}
              />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/20">
                    <img
                      src="/bot.webp"
                      alt=""
                      className="h-full w-full scale-110 object-cover pt-1"
                    />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1.5 font-display text-sm font-medium text-ink-foreground">
                      WealthBridge AI
                      <Sparkles className="size-3.5 text-[var(--accent-strong)] opacity-90" aria-hidden="true" />
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-green-400" />
                      </span>
                      Online · replies instantly
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-full p-2 text-ink-muted transition-colors hover:bg-white/10 hover:text-ink-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isLastBot =
                    msg.role === "bot" && msg.id === lastBotMsgId;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex flex-col gap-2",
                        msg.role === "user" ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex w-max max-w-[85%] flex-col rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                          msg.role === "user"
                            ? "rounded-br-sm text-[var(--accent-foreground)]"
                            : "rounded-bl-sm border border-ink-border bg-ink text-ink-foreground"
                        )}
                        style={
                          msg.role === "user"
                            ? { background: "var(--gradient-accent)" }
                            : undefined
                        }
                      >
                        {msg.content}
                      </div>
                      {msg.options && msg.options.length > 0 && (
                        <div className="flex max-w-[95%] flex-wrap gap-1.5 pt-0.5">
                          {msg.options.map((opt, oi) => {
                            const isStale = !isLastBot;
                            const Icon = iconForOption(opt);
                            return (
                              <motion.button
                                key={opt}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: oi * 0.04,
                                  duration: 0.2,
                                }}
                                disabled={isTyping || isStale}
                                onClick={() => sendMessage(opt)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.6875rem] font-medium transition-colors",
                                  isStale
                                    ? "cursor-default border-ink-border/50 text-ink-muted/50"
                                    : "border-[var(--accent)]/40 text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:opacity-50"
                                )}
                              >
                                {Icon && <Icon className="size-3" aria-hidden="true" />}
                                {opt}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-max max-w-[85%] flex-col rounded-2xl rounded-bl-sm border border-ink-border bg-ink px-4 py-3 text-sm text-ink-foreground shadow-sm"
                  role="status"
                  aria-live="polite"
                >
                  <span className="sr-only">WealthBridge AI is typing…</span>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span
                      className="size-1.5 animate-bounce rounded-full bg-ink-muted"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="size-1.5 animate-bounce rounded-full bg-ink-muted"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="size-1.5 animate-bounce rounded-full bg-ink-muted"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-ink-border bg-ink p-3">
              <form
                onSubmit={handleSend}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about GST, registration, pricing…"
                  aria-label="Type your message"
                  disabled={isTyping}
                  suppressHydrationWarning
                  className="w-full rounded-full border border-ink-border bg-ink-raised py-2.5 pl-4 pr-12 text-sm text-ink-foreground placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity disabled:opacity-50"
                >
                  <Send className="size-3" />
                </button>
              </form>
              <p className="pt-2 text-center text-[0.625rem] text-ink-muted">
                AI-assisted answers · For urgent queries, call {site.phone}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        suppressHydrationWarning
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!hasEverOpened) setHasEverOpened(true);
        }}
        aria-label={isOpen ? "Close chat" : "Open chat with WealthBridge AI Assistant"}
        className="glow fixed bottom-6 right-6 z-50 flex size-[72px] items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl transition-shadow hover:shadow-2xl hover:shadow-accent/20"
      >
        {/* Pulse ring */}
        {!hasEverOpened && (
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-30" />
        )}
        {isOpen ? (
          <X className="size-8" />
        ) : (
          <div className="relative size-[64px] overflow-hidden rounded-full bg-white shadow-inner">
            <img
              src="/bot.webp"
              alt=""
              className="h-full w-full scale-[1.35] object-cover pt-2"
            />
          </div>
        )}
      </motion.button>
    </>
  );
}
