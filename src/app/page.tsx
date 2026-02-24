"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────
// Syntax Highlighter (CSS-class based)
// ─────────────────────────────────────────────
function highlight(raw: string): string {
  const lines = raw.split("\n");
  return lines
    .map((line) => {
      // escape HTML
      let l = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // comments (must be first)
      l = l.replace(/(\/\/.*$)/g, '<span class="hl-cmt">$1</span>');

      // skip further processing if this is a comment line
      if (l.includes('class="hl-cmt"')) return l;

      // template literals (backtick strings)
      l = l.replace(
        /(`[^`]*`)/g,
        '<span class="hl-str">$1</span>'
      );

      // regular strings
      l = l.replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
        '<span class="hl-str">$1</span>'
      );

      // keywords
      l = l.replace(
        /\b(import|export|from|const|let|var|async|await|return|new|class|interface|type|function|extends|implements|typeof|void|null|undefined|true|false|default|if|else|for|while|of|in|break|continue)\b/g,
        '<span class="hl-kw">$1</span>'
      );

      // type names (capitalized words not in strings)
      l = l.replace(
        /\b([A-Z][a-zA-Z0-9]*)\b(?![^<]*&gt;)/g,
        '<span class="hl-cls">$1</span>'
      );

      // numbers
      l = l.replace(
        /(?<![a-zA-Z"'`])\b(\d[\d_]*(?:\.\d+)?)\b(?![a-zA-Z"'`])/g,
        '<span class="hl-num">$1</span>'
      );

      // function calls
      l = l.replace(
        /\b([a-z_$][a-zA-Z0-9_$]*)(?=\s*\()/g,
        '<span class="hl-fn">$1</span>'
      );

      // object properties / keys
      l = l.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)/g,
        '<span class="hl-prop">$1</span>'
      );

      return l;
    })
    .join("\n");
}

interface CodeBlockProps {
  code: string;
  header?: string;
  language?: string;
}

function CodeBlock({ code, header }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block relative">
      {header && (
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            borderBottom: "1px solid #1f2937",
            background: "rgba(31,41,55,0.4)",
          }}
        >
          <span
            className="text-xs font-mono"
            style={{ color: "#6b7280", letterSpacing: "0.05em" }}
          >
            {header}
          </span>
          <div className="flex gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#ef4444", opacity: 0.7 }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#f59e0b", opacity: 0.7 }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#22c55e", opacity: 0.7 }}
            />
          </div>
        </div>
      )}
      <div className="relative group">
        <pre
          dangerouslySetInnerHTML={{ __html: highlight(code.trim()) }}
          style={{
            padding: "1.25rem 1.5rem",
            margin: 0,
            overflowX: "auto",
            fontSize: "13px",
            lineHeight: "1.65",
            color: "#cdd5e0",
          }}
        />
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "rgba(31,41,55,0.9)",
            border: "1px solid #374151",
            color: copied ? "#4ade80" : "#9ca3af",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Reveal on scroll hook
// ─────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const links = [
    { label: "How It Works", id: "how-it-works" },
    { label: "Packages", id: "packages" },
    { label: "Quick Start", id: "quick-start" },
    { label: "Architecture", id: "architecture" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300"
      style={{
        borderBottom: scrolled
          ? "1px solid rgba(31,41,55,0.8)"
          : "1px solid transparent",
        background: scrolled ? "rgba(6,9,15,0.92)" : "transparent",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between"
        style={{ height: "64px" }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9C3 5.69 5.69 3 9 3C12.31 3 15 5.69 15 9C15 12.31 12.31 15 9 15"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9 6V9L11 11"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="5" cy="14" r="2" fill="#fbbf24" opacity="0.6" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "15px", color: "#e5e7eb" }}>
            Agent Stack
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="px-3 py-1.5 rounded-md text-sm transition-colors"
              style={{ color: "#9ca3af", fontFamily: "var(--font-outfit)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e5e7eb")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/arcabotai/agent-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all"
            style={{
              color: "#9ca3af",
              border: "1px solid rgba(31,41,55,0.8)",
              fontFamily: "var(--font-outfit)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#e5e7eb";
              e.currentTarget.style.borderColor = "rgba(75,85,99,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
              e.currentTarget.style.borderColor = "rgba(31,41,55,0.8)";
            }}
          >
            <GitHubIcon size={16} />
            GitHub
          </a>
          <button
            onClick={() => scrollTo("quick-start")}
            className="btn-gold px-4 py-1.5 rounded-md text-sm"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: "#9ca3af" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span
              className="block w-full h-0.5 rounded transition-all"
              style={{
                background: "#9ca3af",
                transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "",
              }}
            />
            <span
              className="block w-full h-0.5 rounded transition-all"
              style={{
                background: "#9ca3af",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-full h-0.5 rounded transition-all"
              style={{
                background: "#9ca3af",
                transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "",
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mobile-menu"
          style={{
            background: "rgba(6,9,15,0.98)",
            borderBottom: "1px solid rgba(31,41,55,0.8)",
            padding: "12px 0",
          }}
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-6 py-3 text-sm"
              style={{ color: "#9ca3af", fontFamily: "var(--font-outfit)" }}
            >
              {link.label}
            </button>
          ))}
          <div className="px-4 pt-2 pb-1 flex gap-2">
            <a
              href="https://github.com/arcabotai/agent-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-md text-sm"
              style={{
                color: "#9ca3af",
                border: "1px solid rgba(31,41,55,0.8)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              GitHub
            </a>
            <button
              onClick={() => scrollTo("quick-start")}
              className="btn-gold flex-1 py-2 rounded-md text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function FarcasterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24.24H5.76A5.76 5.76 0 0 0 0 6v12a5.76 5.76 0 0 0 5.76 5.76h12.48A5.76 5.76 0 0 0 24 18V6A5.76 5.76 0 0 0 18.24.24Zm.816 17.166v.504h-4.956v-.504c.63-.084.756-.168.756-.756v-4.79c0-1.344-.588-2.058-1.722-2.058-1.008 0-1.848.588-2.016.714v6.134c0 .546.126.672.756.756v.504H6.944v-.504c.756-.126.882-.168.882-.756V7.274c0-.588-.126-.63-.882-.756v-.504h4.956v.504c-.63.084-.756.168-.756.756v1.218c.588-.504 1.512-1.218 2.94-1.218 2.058 0 3.192 1.302 3.192 3.696v4.68c0 .588.126.672.882.756Z" />
    </svg>
  );
}

function TwitterXIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center hero-gradient grid-pattern"
      style={{ paddingTop: "96px", paddingBottom: "80px" }}
    >
      {/* Radial overlay to fade grid near center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(6,9,15,0) 0%, rgba(6,9,15,0.7) 100%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 animate-fade-in"
          style={{
            background: "rgba(251,191,36,0.08)",
            border: "1px solid rgba(251,191,36,0.2)",
            animationDelay: "0.1s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#fbbf24" }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: "#fbbf24", fontFamily: "var(--font-outfit)", letterSpacing: "0.05em" }}
          >
            Open Source · Built by arcabot.ai
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 animate-fade-up"
          style={{
            fontFamily: "var(--font-sora)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            animationDelay: "0.15s",
            opacity: 0,
            animationFillMode: "forwards",
            color: "#f3f4f6",
          }}
        >
          Agent Stack SDK
        </h1>

        {/* Tagline */}
        <p
          className="text-xl sm:text-2xl font-medium mb-6 animate-fade-up"
          style={{
            fontFamily: "var(--font-sora)",
            animationDelay: "0.25s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <span className="text-gradient">One package.</span>
          <span style={{ color: "#9ca3af" }}> Three layers.</span>
          <br className="sm:hidden" />
          <span style={{ color: "#9ca3af" }}> Identity. Payments. Data.</span>
        </p>

        {/* Description */}
        <p
          className="text-lg max-w-2xl mx-auto mb-10 animate-fade-up"
          style={{
            color: "#6b7280",
            fontFamily: "var(--font-outfit)",
            lineHeight: 1.7,
            animationDelay: "0.35s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          The missing glue between AI agent identity (ERC-8004), payments (x402/USDC),
          and data exchange (MCP). Build paid AI agent services in 10 lines of code.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-up"
          style={{
            animationDelay: "0.45s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <button
            className="btn-gold px-7 py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2"
            onClick={() =>
              document
                .getElementById("quick-start")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Get Started
          </button>
          <a
            href="https://github.com/arcabotai/agent-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-7 py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2"
          >
            <GitHubIcon size={18} />
            View on GitHub
          </a>
        </div>

        {/* Install snippet */}
        <div
          className="inline-flex items-center gap-3 animate-fade-up"
          style={{
            animationDelay: "0.55s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
            style={{
              background: "rgba(13,17,23,0.8)",
              border: "1px solid #1f2937",
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#6b7280" }}>$</span>
            <span style={{ color: "#c3e88d" }}>npm install </span>
            <span style={{ color: "#89ddff" }}>@agent-stack/core</span>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-up"
          style={{
            animationDelay: "0.65s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          {[
            { value: "17+", label: "Chains" },
            { value: "4", label: "Packages" },
            { value: "x402 v2", label: "Protocol" },
            { value: "ERC-8004", label: "Standard" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-sora)", color: "#fbbf24" }}
              >
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
        style={{ opacity: 0.4 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 15l7 7 7-7"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// How It Works
// ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🪪",
      title: "Agent A registers on-chain",
      description:
        "Agent A calls the ERC-8004 registry on Base (or 16 other chains). A token is minted to its wallet, pointing to a registration file with name, services, and x402 payment flag.",
      detail: "eip155:8453:0x8004...#2376",
      color: "#818cf8",
    },
    {
      number: "02",
      icon: "🔌",
      title: "Agent A starts a paid MCP server",
      description:
        "Agent A spins up an MCP server with x402 payment middleware. Unauthenticated callers receive a 402 response with USDC payment requirements. Registered tools remain private until paid.",
      detail: "http://localhost:3000/mcp · 0.01 USDC/call",
      color: "#34d399",
    },
    {
      number: "03",
      icon: "⚡",
      title: "Agent B discovers, connects, and pays",
      description:
        "Agent B looks up A's global ID on-chain, resolves the MCP endpoint, auto-signs an EIP-3009 USDC authorization, and retries — all in one createAgentMcpClient() call.",
      detail: "Payment: gasless · Settlement: on-chain",
      color: "#fbbf24",
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: "96px 0 80px" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span
            className="text-xs uppercase tracking-widest mb-3 block"
            style={{ color: "#fbbf24", fontFamily: "var(--font-outfit)" }}
          >
            The Protocol
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-sora)", color: "#f3f4f6" }}
          >
            How It Works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280", fontFamily: "var(--font-outfit)" }}>
            Three protocols. One SDK. Agents that identify, charge, and serve each other
            — no middlemen, no API keys.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.number} className={`reveal reveal-delay-${i + 1}`}>
              <div className="flex gap-6">
                {/* Left: number + connector */}
                <div className="flex flex-col items-center" style={{ minWidth: "48px" }}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                      border: `1px solid ${step.color}40`,
                    }}
                  >
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-px flex-1 mt-3"
                      style={{
                        background: `linear-gradient(to bottom, ${step.color}40, transparent)`,
                        minHeight: "40px",
                      }}
                    />
                  )}
                </div>

                {/* Right: content */}
                <div className={`pb-${i < steps.length - 1 ? "10" : "0"}`} style={{ paddingBottom: i < steps.length - 1 ? "40px" : 0 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-mono"
                      style={{ color: step.color, opacity: 0.7 }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontFamily: "var(--font-sora)", color: "#f3f4f6" }}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p
                    className="mb-3 leading-relaxed"
                    style={{ color: "#6b7280", fontFamily: "var(--font-outfit)", fontSize: "15px" }}
                  >
                    {step.description}
                  </p>
                  <div
                    className="inline-flex items-center px-3 py-1.5 rounded-md"
                    style={{
                      background: "rgba(13,17,23,0.8)",
                      border: "1px solid #1f2937",
                      fontFamily: "var(--font-ibm-plex-mono)",
                      fontSize: "12px",
                      color: step.color,
                    }}
                  >
                    {step.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div className="mt-16 reveal">
          <div
            className="glass-card rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {[
                { label: "Lookup", sub: "ERC-8004 registry", icon: "🔍" },
                { label: "Fetch", sub: "Registration file", icon: "📄" },
                { label: "Connect", sub: "MCP endpoint", icon: "🔌" },
                { label: "Pay", sub: "x402 USDC", icon: "💳" },
                { label: "Process", sub: "Tool result", icon: "✅" },
              ].map((node, i) => (
                <div key={node.label} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2"
                      style={{
                        background: "rgba(31,41,55,0.8)",
                        border: "1px solid rgba(251,191,36,0.15)",
                      }}
                    >
                      {node.icon}
                    </div>
                    <span
                      className="text-sm font-medium block"
                      style={{ color: "#e5e7eb", fontFamily: "var(--font-sora)" }}
                    >
                      {node.label}
                    </span>
                    <span className="text-xs block mt-0.5" style={{ color: "#4b5563" }}>
                      {node.sub}
                    </span>
                  </div>
                  {i < 4 && (
                    <svg
                      width="24"
                      height="12"
                      viewBox="0 0 24 12"
                      className="hidden sm:block flex-shrink-0"
                      fill="none"
                    >
                      <path
                        d="M0 6h20M16 2l4 4-4 4"
                        stroke="rgba(251,191,36,0.4)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Packages
// ─────────────────────────────────────────────
function Packages() {
  const packages = [
    {
      name: "@agent-stack/identity",
      tagline: "On-chain agent registration",
      description:
        "Register, verify, and discover AI agents across 17+ EVM chains using the ERC-8004 standard. Mint your agent ID once, use it everywhere.",
      color: "#818cf8",
      icon: "🪪",
      features: ["ERC-8004 registry", "Multi-chain support", "Global agent IDs", "Back-reference verification"],
      code: `import { AgentIdentity } from "@agent-stack/identity";
import { base } from "viem/chains";

const identity = new AgentIdentity({ account, chain: base });

const { agentId, globalId } = await identity.register({
  name: "MyAgent",
  services: [{ name: "MCP", endpoint: "https://mcp.myagent.ai/mcp" }],
  x402Support: true,
});
// globalId: "eip155:8453:0x8004...#42"`,
    },
    {
      name: "@agent-stack/payments",
      tagline: "x402 USDC payments",
      description:
        "Accept and send USDC micropayments between agents using the x402 protocol. Gasless EIP-3009 signatures, auto-retry on 402, no custodians.",
      color: "#34d399",
      icon: "💳",
      features: ["x402 protocol v2", "Gasless EIP-3009", "Auto-pay client", "Express middleware"],
      code: `import { createPaymentClient } from "@agent-stack/payments";

const payer = createPaymentClient({ account });

// Auto-pays any x402 requirement
const response = await payer.fetch(
  "https://api.agent.ai/tool"
);

const balance = await payer.getBalance("eip155:8453");
// { formatted: "1.500000", symbol: "USDC" }`,
    },
    {
      name: "@agent-stack/data",
      tagline: "MCP servers + clients",
      description:
        "Spin up MCP servers with built-in identity exposure and payment gating. Connect to other agents by their ERC-8004 global ID — auto-resolves URL, auto-pays.",
      color: "#38bdf8",
      icon: "🔌",
      features: ["MCP 2025-06-18", "Identity resource", "Payment gating", "Auto-discovery"],
      code: `import { createAgentMcpServer, createAgentMcpClient }
  from "@agent-stack/data";

const server = createAgentMcpServer({
  payment: { amount: "10000" }, // 0.01 USDC
});
server.tool("get-data", { query: z.string() },
  async ({ query }) => ({ content: [{ type: "text",
    text: await fetchData(query) }] }));
await server.listen(3000);`,
    },
    {
      name: "@agent-stack/core",
      tagline: "The all-in-one class",
      description:
        "AgentStack wires identity + payments + data into one cohesive class. Register on-chain, start your server, connect to peers — all from a single import.",
      color: "#fbbf24",
      icon: "⚡",
      features: ["All-in-one API", "Zero-config defaults", "Full TypeScript", "Modular re-exports"],
      code: `import { AgentStack } from "@agent-stack/core";

const agent = new AgentStack({ account, chain: base,
  server: { name: "MyAgent",
    payment: { amount: "1000" } } });

agent.tool("analyze", { query: z.string() },
  async ({ query }) => ({ content: [{ type: "text",
    text: "Analysis: " + query }] }));

await agent.start(); // MCP at :3000, x402 enabled`,
    },
  ];

  return (
    <section id="packages" style={{ padding: "80px 0", background: "rgba(17,24,39,0.3)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span
            className="text-xs uppercase tracking-widest mb-3 block"
            style={{ color: "#fbbf24", fontFamily: "var(--font-outfit)" }}
          >
            Modular by Design
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-sora)", color: "#f3f4f6" }}
          >
            Four Packages. One Stack.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280", fontFamily: "var(--font-outfit)" }}>
            Use each package standalone or combine them via{" "}
            <code
              className="text-sm px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.2)",
                color: "#fbbf24",
                fontFamily: "var(--font-ibm-plex-mono)",
              }}
            >
              @agent-stack/core
            </code>
            .
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packages.map((pkg, i) => (
            <div
              key={pkg.name}
              className={`glass-card rounded-2xl overflow-hidden reveal reveal-delay-${(i % 2) + 1}`}
            >
              {/* Card header */}
              <div
                className="p-6 pb-4"
                style={{ borderBottom: "1px solid rgba(31,41,55,0.8)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: `${pkg.color}15`,
                      border: `1px solid ${pkg.color}30`,
                    }}
                  >
                    {pkg.icon}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-mono text-sm mb-1"
                      style={{ color: pkg.color, fontFamily: "var(--font-ibm-plex-mono)" }}
                    >
                      {pkg.name}
                    </div>
                    <div
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-sora)", color: "#f3f4f6" }}
                    >
                      {pkg.tagline}
                    </div>
                  </div>
                </div>

                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "#6b7280", fontFamily: "var(--font-outfit)" }}
                >
                  {pkg.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {pkg.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: `${pkg.color}10`,
                        border: `1px solid ${pkg.color}25`,
                        color: pkg.color,
                        fontFamily: "var(--font-outfit)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code snippet */}
              <CodeBlock code={pkg.code} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Quick Start
// ─────────────────────────────────────────────
const QUICKSTART_SERVER = `import { AgentStack } from "@agent-stack/core";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

// 1. Create your agent
const agent = new AgentStack({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
  server: {
    name: "MyAgent",
    payment: { amount: "1000" }, // 0.001 USDC per call
  },
});

// 2. Add a tool
agent.tool("analyze", { query: z.string() }, async ({ query }) => ({
  content: [{ type: "text", text: "Analysis: " + query }],
}));

// 3. Start the server (MCP at http://localhost:3000/mcp)
await agent.start();
console.log("Agent running — accepting x402 payments");`;

const QUICKSTART_CLIENT = `import { createAgentMcpClient } from "@agent-stack/data";
import { privateKeyToAccount } from "viem/accounts";

// 4. Another agent connects by global ID (auto-resolves + auto-pays)
const client = await createAgentMcpClient({
  agentId: "eip155:8453:0x8004...#42", // ERC-8004 global ID
  payer: {
    account: privateKeyToAccount(process.env.PAYER_KEY),
    maxAmount: "10000", // safety cap: 0.01 USDC
  },
});

// 5. Call a tool — payment of 0.001 USDC happened automatically
const result = await client.callTool("analyze", {
  query: "ETH price trend last 24h",
});

console.log(result); // { content: [{ type: "text", text: "Analysis: ..." }] }
await client.close();`;

const QUICKSTART_REGISTER = `// Optional: register on-chain (once, costs gas)
const { agentId, globalId } = await agent.register({
  name: "MyAgent",
  description: "An AI agent that analyzes crypto data",
  x402Support: true,
  includeServerEndpoint: true, // auto-adds MCP URL to services
});

console.log("Registered:", globalId);
// eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432#42`;

function QuickStart() {
  const [tab, setTab] = useState<"server" | "client" | "register">("server");

  return (
    <section id="quick-start" style={{ padding: "80px 0" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span
            className="text-xs uppercase tracking-widest mb-3 block"
            style={{ color: "#fbbf24", fontFamily: "var(--font-outfit)" }}
          >
            Get Going Fast
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-sora)", color: "#f3f4f6" }}
          >
            Quick Start
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280", fontFamily: "var(--font-outfit)" }}>
            A paid AI agent server in 15 lines. A client that pays automatically in 10.
          </p>
        </div>

        {/* Install */}
        <div className="max-w-2xl mx-auto mb-8 reveal">
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #1f2937" }}
          >
            <div className="text-xs mb-2" style={{ color: "#4b5563", fontFamily: "var(--font-outfit)" }}>
              Install
            </div>
            <div style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: "13px" }}>
              <span style={{ color: "#6b7280" }}>$ </span>
              <span style={{ color: "#c3e88d" }}>npm install </span>
              <span style={{ color: "#89ddff" }}>
                @agent-stack/core viem @x402/fetch @x402/evm @modelcontextprotocol/sdk zod
              </span>
            </div>
          </div>
        </div>

        {/* Tabs + Code */}
        <div className="max-w-3xl mx-auto reveal">
          {/* Tab bar */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-3 w-fit"
            style={{ background: "rgba(17,24,39,0.8)", border: "1px solid #1f2937" }}
          >
            {(
              [
                { id: "server", label: "Server (Agent A)" },
                { id: "client", label: "Client (Agent B)" },
                { id: "register", label: "Register on-chain" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? "rgba(251,191,36,0.12)" : "transparent",
                  color: tab === t.id ? "#fbbf24" : "#6b7280",
                  border: tab === t.id ? "1px solid rgba(251,191,36,0.25)" : "1px solid transparent",
                  fontFamily: "var(--font-outfit)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <CodeBlock
            code={
              tab === "server"
                ? QUICKSTART_SERVER
                : tab === "client"
                ? QUICKSTART_CLIENT
                : QUICKSTART_REGISTER
            }
            header={
              tab === "server"
                ? "agent-server.ts"
                : tab === "client"
                ? "agent-client.ts"
                : "register.ts"
            }
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Architecture
// ─────────────────────────────────────────────
function Architecture() {
  return (
    <section
      id="architecture"
      style={{ padding: "80px 0", background: "rgba(17,24,39,0.2)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span
            className="text-xs uppercase tracking-widest mb-3 block"
            style={{ color: "#fbbf24", fontFamily: "var(--font-outfit)" }}
          >
            For Builders
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-sora)", color: "#f3f4f6" }}
          >
            Architecture
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280", fontFamily: "var(--font-outfit)" }}>
            Under the hood: how agents find each other, verify identity, and settle payments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 5-step flow */}
          <div className="reveal">
            <h3
              className="text-lg font-semibold mb-6"
              style={{ fontFamily: "var(--font-sora)", color: "#e5e7eb" }}
            >
              The Full Agent-to-Agent Flow
            </h3>
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: "Lookup",
                  desc: "Agent B reads A's global ID from ERC-8004 registry — gets owner, payment wallet, tokenURI",
                },
                {
                  step: 2,
                  title: "Fetch Registration",
                  desc: "B fetches A's registration file (data URI / IPFS / HTTPS), verifies back-reference",
                },
                {
                  step: 3,
                  title: "Connect MCP",
                  desc: "B connects to A's MCP endpoint using payment-wrapped fetch — first call returns 402",
                },
                {
                  step: 4,
                  title: "Pay x402",
                  desc: "Client auto-signs EIP-3009 authorization (gasless), retries with X-PAYMENT header",
                },
                {
                  step: 5,
                  title: "Process",
                  desc: "A verifies payment, returns tool result. Receipt in X-PAYMENT-RESPONSE header",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(17,24,39,0.6)", border: "1px solid rgba(31,41,55,0.6)" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: "rgba(251,191,36,0.15)",
                      color: "#fbbf24",
                      fontFamily: "var(--font-sora)",
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#e5e7eb", fontFamily: "var(--font-sora)" }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "#6b7280", fontFamily: "var(--font-outfit)", lineHeight: 1.5 }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: protocols + addresses */}
          <div className="space-y-8 reveal reveal-delay-2">
            {/* Protocol versions */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-sora)", color: "#e5e7eb" }}
              >
                Protocol Versions
              </h3>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(31,41,55,0.8)" }}
              >
                <table className="proto-table">
                  <thead>
                    <tr>
                      <th className="text-left">Protocol</th>
                      <th className="text-left">Version</th>
                      <th className="text-left">Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "#34d399", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "13px" }}>x402</td>
                      <td style={{ color: "#9ca3af", fontFamily: "var(--font-outfit)", fontSize: "13px" }}>v2 (CAIP-2)</td>
                      <td style={{ color: "#6b7280", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "12px" }}>@x402/fetch + @x402/evm</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#818cf8", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "13px" }}>ERC-8004</td>
                      <td style={{ color: "#9ca3af", fontFamily: "var(--font-outfit)", fontSize: "13px" }}>draft 2025-08-13</td>
                      <td style={{ color: "#6b7280", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "12px" }}>@agent-stack/identity</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#38bdf8", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "13px" }}>MCP</td>
                      <td style={{ color: "#9ca3af", fontFamily: "var(--font-outfit)", fontSize: "13px" }}>2025-06-18</td>
                      <td style={{ color: "#6b7280", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "12px" }}>@modelcontextprotocol/sdk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key addresses */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-sora)", color: "#e5e7eb" }}
              >
                Key Addresses (Base Mainnet)
              </h3>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(31,41,55,0.8)" }}
              >
                <table className="proto-table">
                  <thead>
                    <tr>
                      <th className="text-left">Contract</th>
                      <th className="text-left">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "ERC-8004 Registry", addr: "0x8004A169FB4a...9432" },
                      { name: "USDC", addr: "0x833589fCD6eD...2913" },
                      { name: "Permit2", addr: "0x000000000022...BA3" },
                    ].map((row) => (
                      <tr key={row.name}>
                        <td style={{ color: "#9ca3af", fontFamily: "var(--font-outfit)", fontSize: "13px" }}>{row.name}</td>
                        <td style={{ color: "#6b7280", fontFamily: "var(--font-ibm-plex-mono)", fontSize: "12px" }}>{row.addr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dependency graph */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-sora)", color: "#e5e7eb" }}
              >
                Dependency Graph
              </h3>
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #1f2937" }}
              >
                <pre
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  {`@agent-stack/core
  ├── `}
                  <span style={{ color: "#818cf8" }}>@agent-stack/identity</span>
                  {`
  ├── `}
                  <span style={{ color: "#34d399" }}>@agent-stack/payments</span>
                  {`
  └── `}
                  <span style={{ color: "#38bdf8" }}>@agent-stack/data</span>
                  {`
        ├── `}
                  <span style={{ color: "#818cf8" }}>@agent-stack/identity</span>
                  {`
        └── `}
                  <span style={{ color: "#34d399" }}>@agent-stack/payments</span>
                </pre>
              </div>
            </div>

            {/* Supported chains */}
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-sora)", color: "#e5e7eb" }}
              >
                Deployed on 17+ Chains
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Ethereum", "Base", "Arbitrum", "Polygon", "Optimism",
                  "Celo", "BNB", "Gnosis", "Linea", "Scroll",
                  "Taiko", "Avalanche", "Mantle", "Metis", "Abstract", "Monad", "+"
                ].map((chain) => (
                  <span
                    key={chain}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(31,41,55,0.8)",
                      border: "1px solid rgba(55,65,81,0.6)",
                      color: chain === "Base" ? "#fbbf24" : "#6b7280",
                      fontFamily: "var(--font-outfit)",
                    }}
                  >
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer / Built By
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer
      id="built-by"
      style={{
        borderTop: "1px solid rgba(31,41,55,0.6)",
        padding: "64px 0 40px",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Built by section */}
        <div className="text-center mb-12 reveal">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.15)",
            }}
          >
            <span className="text-xs" style={{ color: "#fbbf24", fontFamily: "var(--font-outfit)" }}>
              Built with ❤️ by
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <a
              href="https://arcabot.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold transition-colors"
              style={{ fontFamily: "var(--font-sora)", color: "#fbbf24" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#fbbf24")}
            >
              arcabot.ai
            </a>
          </div>
          <p
            className="text-base max-w-md mx-auto"
            style={{ color: "#6b7280", fontFamily: "var(--font-outfit)", lineHeight: 1.7 }}
          >
            Turnkey infrastructure for deploying
            AI agents with identity, payments, and data built-in.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 reveal">
          {[
            { href: "https://github.com/arcabotai/agent-stack", label: "GitHub", icon: <GitHubIcon size={18} /> },
            { href: "https://warpcast.com/arcabot.eth", label: "Farcaster", icon: <FarcasterIcon size={18} /> },
            { href: "https://twitter.com/arcabotai", label: "Twitter", icon: <TwitterXIcon size={18} /> },
            { href: "https://arcabot.ai", label: "Website", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )},
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
              style={{
                color: "#6b7280",
                border: "1px solid rgba(31,41,55,0.8)",
                fontFamily: "var(--font-outfit)",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e5e7eb";
                e.currentTarget.style.borderColor = "rgba(55,65,81,0.8)";
                e.currentTarget.style.background = "rgba(31,41,55,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#6b7280";
                e.currentTarget.style.borderColor = "rgba(31,41,55,0.8)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(31,41,55,0.4)" }}
        >
          <div
            className="flex items-center gap-2"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "13px", color: "#374151" }}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <path d="M3 9C3 5.69 5.69 3 9 3C12.31 3 15 5.69 15 9C15 12.31 12.31 15 9 15" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9 6V9L11 11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5" cy="14" r="2" fill="#fbbf24" opacity="0.6" />
              </svg>
            </div>
            Agent Stack SDK
          </div>

          <div
            className="flex items-center gap-4"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "12px", color: "#374151" }}
          >
            <span>MIT License</span>
            <span>·</span>
            <a
              href="mailto:arca@arcabot.ai"
              style={{ color: "#4b5563" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              arca@arcabot.ai
            </a>
            <span>·</span>
            <span>© 2025 arcabot.ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Root Page
// ─────────────────────────────────────────────
export default function Page() {
  useReveal();

  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Packages />
      <QuickStart />
      <Architecture />
      <Footer />
    </main>
  );
}
