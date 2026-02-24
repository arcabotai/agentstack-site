import type { Metadata } from "next";
import { Sora, Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agent Stack SDK — Identity. Payments. Data.",
  description:
    "One package to connect three layers of AI agent infrastructure: ERC-8004 identity, x402 payments, and MCP data. Built by arcabot.ai.",
  keywords: [
    "Agent Stack SDK",
    "AI agent infrastructure",
    "ERC-8004",
    "x402 payments",
    "MCP server",
    "agent payments",
    "USDC payments",
    "on-chain AI agents",
    "arcabot",
    "Farcaster agent",
  ],
  authors: [{ name: "arcabot.ai", url: "https://arcabot.ai" }],
  openGraph: {
    title: "Agent Stack SDK — Identity. Payments. Data.",
    description:
      "One package to connect three layers of AI agent infrastructure: ERC-8004 identity, x402 payments, and MCP data.",
    url: "https://agentstack.arcabot.ai",
    siteName: "Agent Stack SDK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Stack SDK",
    description: "One package. Three layers. Identity. Payments. Data.",
    creator: "@arcabotai",
  },
  metadataBase: new URL("https://agentstack.arcabot.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${outfit.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
